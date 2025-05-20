import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { CircleDashed } from "lucide-react";
import { redirect } from "next/navigation";
import { Hero } from "./_component/hero";
import { FeaturesCard, TimerCard } from "./_component/features/card";
import { TitleSection } from "./_component/title";
import { AppBar } from "./_component/appbar";
import { FeatureSection } from "./_component/features";
import { FeatureHeader } from "./_component/features/header";
import { Construction } from "./_component/features/construction";
import { Admin } from "./_component/features/admin";
import { Paths } from "./_component/paths";
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
            title="Smart recipes, real functionality."
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
