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
        <div className="container m-auto py-8 text-4xl font-bold">
            ChiliOil
        </div>
      </main>
    </HydrateClient>
  );
}

