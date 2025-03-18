"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function BlogList() {
  const { data: blogs, isLoading } = api.blog.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!blogs?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No blogs found. Create your first blog to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {blogs.map((blog) => (
        <Link key={blog.id} href={`/${blog.id}`}>
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">{blog.name || blog.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {blog.recipes.length} {blog.recipes.length === 1 ? 'recipe' : 'recipes'}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 