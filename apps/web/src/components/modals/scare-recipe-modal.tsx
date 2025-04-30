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

interface ScrapeRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeBookId: string;
}

export function ScrapeRecipeDialog({ open, onOpenChange, activeBookId }: ScrapeRecipeDialogProps) {
  const [url, setUrl] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const { data: metadata } = api.scraper.getWebsiteMetadata.useQuery(
    { domain: url },
    {
      enabled: !!url,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const handleScrape = () => {
    if (!url) return;
    setIsNavigating(true);
    onOpenChange(false);
    router.push(`/admin/${activeBookId}/create?url=${encodeURIComponent(url)}`);
  };

  useEffect(() => {
    if (!open) {
      setUrl("");
      setIsNavigating(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isNavigating) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Recipe from URL</DialogTitle>
          <DialogDescription>
            Enter a URL to scrape a recipe. We'll automatically detect and import the recipe details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Recipe URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/recipe"
              required
              disabled={isNavigating}
            />
            {metadata && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img src={metadata.favicon} alt="" className="h-4 w-4" />
                <span>{metadata.domain}</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={!url || isNavigating}
            onClick={handleScrape}
          >
            {isNavigating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import Recipe"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}