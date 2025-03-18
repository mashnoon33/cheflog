import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <div className="bg-purple-100 py-16">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-purple-900 mb-4">
          Start Your Recipe Collection Today
        </h2>
        <p className="text-xl text-purple-700 mb-8 max-w-2xl mx-auto">
          Join our community and begin organizing your culinary masterpieces
        </p>
        <Link href="/create">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Add Your First Recipe
          </Button>
        </Link>
      </div>
    </div>
  );
} 