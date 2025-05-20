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
export default async function Home() {
  // Check if user is authenticated and redirect to admin page if they are
  const session = await auth();
  if (session?.user) {
    return redirect("/admin");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen w-full flex-col bg-gradient-to-b from-blue-50 to-white">
        <div className="gap-10 flex flex-col max-w-6xl w-full mx-auto px-5 mb-20">
          <AppBar />
          <TitleSection />
          <Hero />
          {/* <FeatureHeader title="Encodings" description="Chefbook encodes recipes in a way that is easy to understand and use." /> */}
          <FeatureSection />
          <Admin />
          <Construction />

        </div>
      </main>
    </HydrateClient>
  );
}