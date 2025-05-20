import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
export function Paths() {
  return (
    <div className="grid h-auto w-full grid-cols-1 gap-5 md:h-[300px] md:grid-cols-2">
      <Link href="/admin">
        <Card className="flex h-full cursor-pointer flex-col gap-2 p-5 hover:bg-neutral-50">
          <h1 className="text-2xl font-bold text-blue-800">
            I'm a recipe writer
          </h1>
          <p className="text-sm text-blue-800/70">
            Whether you're documenting grandma’s classic or riffing on someone
            else’s creation or cataologing your resturants recipes, Cheflog
            gives you the tools to do it right.
          </p>
          <div className="mt-auto flex flex-row justify-end gap-2">
            <div className="flex flex-row items-center gap-2 text-sm text-blue-800 hover:text-blue-800/80">
              Take me to the cookbook
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </div>
        </Card>
      </Link>
      <Link href="/public">
        <Card className="flex h-full cursor-pointer flex-col gap-2 p-5 hover:bg-neutral-50">
          <h1 className="text-2xl font-bold text-blue-800">
            I just want to cook
          </h1>
          <p className="text-sm text-blue-800/70">
            Smart recipe features like timers, ingredient scaling, and version
            control make it easy to cook delicious meals. We compile a directory
            of all publicly available cookbookls and recipes.
          </p>
          <div className="mt-auto flex flex-row justify-end gap-2">
            <div className="flex flex-row items-center gap-2 text-sm text-blue-800 hover:text-blue-800/80">
              Explore public recipes
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
