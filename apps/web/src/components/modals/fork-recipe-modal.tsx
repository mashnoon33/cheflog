"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


interface ForkRecipeModalProps {
  open: boolean;
  recipeId: string;
  forkedFromBookId: string;
  onOpenChange: (open: boolean) => void;
}

export function ForkRecipeModal({ recipeId, forkedFromBookId, open, onOpenChange }: ForkRecipeModalProps) {
  const [bookId, setBookId] = useState<string | null>(null);
  const router = useRouter();
  const { data: books } = api.book.getAll.useQuery();
  const { mutate: forkRecipe, isPending } = api.fork.forkRecipe.useMutation({
    onSuccess: (data) => {
      toast.success("Recipe forked successfully");
      onOpenChange(false);
      router.push(`/admin/${data.bookId}/${data.id}`);
    },
    onError: () => {
      toast.error("Failed to fork recipe");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    bookId && forkRecipe({ recipeId, bookId: bookId, forkedFromBookId: forkedFromBookId });
  }

  const handleBookChange = (value: string) => {
    setBookId(value);
  }


  useEffect(() => {
    // Reset form when dialog closes
    if (!open) {
      // reset form
      setBookId(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Fork Recipe</DialogTitle>
            <DialogDescription>
              Fork a recipe to a new book.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Books</Label>
              {/* {JSON.stringify(books)} */}
              <Select onValueChange={handleBookChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent>
                  {books?.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      <div className="flex flex-col  w-full justify-start ml-2">
                        <div className=" justify-start text-left">{book.name?.trim()}</div>
                        <span className="text-sm text-muted-foreground text-left">
                          {book.recipes.length} recipes
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !bookId}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Fork Recipe"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}