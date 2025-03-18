import { HydrateClient } from "@/trpc/server";
import { CallToAction } from "./_components/CallToAction";
import { Features } from "./_components/Features";
import { Hero } from "./_components/Hero";
import { AuthButton } from "./_components/AuthButton";
import { CreateBlogDialog } from "@/components/modals/create-blog-dialog";
import { BlogList } from "./_components/BlogList";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <Hero />
        <Features />
        <div className="container mx-auto py-8">
          <h2 className="text-2xl font-bold mb-6">Your Blogs</h2>
          <BlogList />
        </div>
        <CallToAction />
        <div className="flex items-center justify-center gap-4 p-4">
          <AuthButton />
          <CreateBlogDialog />
        </div>
      </main>
    </HydrateClient>
  );
}

export function Auth() {
  return (
    <div className="flex items-center justify-center p-4">
      <AuthButton />
    </div>
  );
}