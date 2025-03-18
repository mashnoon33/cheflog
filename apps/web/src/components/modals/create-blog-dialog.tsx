"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";

export function CreateBlogDialog() {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const router = useRouter();
  const { mutate: createBlog, isPending } = api.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog created successfully!");
      setOpen(false);
      router.push(`/${slug}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBlog({ slug });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Blog</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new blog</DialogTitle>
            <DialogDescription>
              Create a new blog to organize your recipes. The slug will be used in the URL.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="slug">Blog Slug</label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-awesome-blog"
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                required
              />
              <p className="text-sm text-muted-foreground">
                Use lowercase letters, numbers, and hyphens only. No spaces allowed.
              </p>
            </div>
          </div>
          <DialogFooter>
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
                "Create Blog"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}