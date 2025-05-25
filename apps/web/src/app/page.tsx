import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import { AppBar } from "./_component/appbar";
import { FeatureSection } from "./_component/features";
import { Admin } from "./_component/features/admin";
import { Construction } from "./_component/features/construction";
import { FeatureHeader } from "./_component/features/header";
import { Hero } from "./_component/hero";
import { Paths } from "./_component/paths";
import { TitleSection } from "./_component/title";
export default async function Home() {
  // Check if user is authenticated and redirect to admin page if they are
  const session = await auth();
  if (session?.user) {
    return redirect("/admin");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen w-full flex-col bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto mb-20 flex w-full max-w-6xl flex-col gap-10 px-5">
          <AppBar />
          <TitleSection />
          <Hero />
          <FeatureHeader
            title="Smart recipes, powerful functionality."
            description=" Cheflog recipes aren't just text—they're structured data. That means richer interactions, smarter tools, and features that go beyond static cookbooks."
          />
          <FeatureSection />
          <FeatureHeader
            title="Version control for your kitchen."
            description=" Every recipe is tracked like code. See diffs, leave commit messages, and collaborate with others. Fork existing Cheflogs and build your own variations."
          />
          <Admin />
          <FeatureHeader
            title="Lets get cooking."
            description="Whether you're a home cook or a professional chef, amaterur writer or a recipe collector, or bonefied cookbook author, Cheflog has you covered."
          />

          <Paths />
      
          <Construction />
        </div>
      </main>
    </HydrateClient>
  );
}
