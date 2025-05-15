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
import { useState, useEffect } from "react";

import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch"

interface CreateBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBookDialog({ open, onOpenChange }: CreateBookDialogProps) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();
  const utils = api.useUtils();
  const { data: slugCheck, isPending: isCheckingSlug } = api.book.checkSlug.useQuery(
    { slug },
    {
      enabled: !!slug,
      trpc: {
        context: {
          skipBatch: true,
        }
      },
      staleTime: 1000 * 30, // 30 seconds
      refetchOnWindowFocus: false,
    }
  );
  const { mutate: createBook, isPending } = api.book.create.useMutation({
    onSuccess: () => {
      toast.success("Book created successfully!");
      onOpenChange(false);
      router.push(`/admin/${slug}`);
      utils.book.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formatSlug = (input: string) => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim(); // Remove leading/trailing spaces
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBook({ slug, name, markdown, public: isPublic });
  };

  useEffect(() => {
    // Reset form when dialog closes
    if (!open) {
      setName("");
      setSlug("");
      setMarkdown("");
      setSlugDirty(false);
      setIsPublic(true);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new book</DialogTitle>
            <DialogDescription>
              Books are a way to organize your recipes. They are public by default. Slug defines the URL of the book.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  !slugDirty && setSlug(formatSlug(e.target.value));
                }}
                placeholder="My Awesome Book"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label >
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(formatSlug(e.target.value));
                  setSlugDirty(true);
                }}
                placeholder="my-awesome-book"
                required
              />
              {!slug && <p className="text-muted-foreground text-sm">Dash-separated string with no spaces</p>}
              {slug && (
                <div className="text-sm">
                  {isCheckingSlug ? (
                    <p className="text-muted-foreground"><Loader2 className="mr-1 h-4 w-4 inline animate-spin" />Checking availability</p>
                  ) : slugCheck?.available ? (
                    <p className="text-green-600">✓ cheflog.app/<strong>{slugCheck?.slug}</strong> is available</p>
                  ) : (
                    <p className="text-red-600">✗ cheflog.app/<strong>{slugCheck?.slug}</strong>  is already taken</p>
                  )}
                </div>
              )}
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="markdown">Description</Label>
              <textarea
                id="markdown"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="A brief description of your book..."
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div> */}
          </div>
          <DialogFooter className="flex flex-col gap-2 justify-between w-full">
            <div className="grid gap-2 w-full">
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public" className="cursor-pointer">
                  {isPublic ? "Public" : "Private"}
                </Label>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isPending || !slug}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Book"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}