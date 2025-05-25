import { Button } from "@/components/ui/button";
import { ContainerTextFlip } from "@/components/ui/text-flip";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";
export function TitleSection() {
  return (
    <div className="relative flex w-full flex-col gap-4 text-center">
      <span className="absolute left-1/2 top-0 w-full -translate-x-1/2 text-sm font-bold text-neutral-700 md:text-lg lg:text-lg">
        <ContainerTextFlip
          className="text-sm text-blue-500 md:text-lg lg:text-lg"
          words={["versioned CMS", "language specification", "recipe editor"]}
        />
      </span>
      <h1 className="mt-8 text-4xl font-bold md:text-6xl lg:mt-10">
        Recipes reimagined{" "}
      </h1>
      <p className="mx-auto max-w-2xl text-neutral-700">
        A markdown-inspired recipe format, powerful text editor, and
        purpose-built CMS for smart, modern, versioned recipes.
      </p>
      <div className="mt-5 flex flex-row justify-center gap-2">
        <Link href="/admin">
          <Button>Get Started</Button>
        </Link>
        <Link href="/public">
          <Button variant="outline">Public cookbooks</Button>
        </Link>
        <Link href="https://github.com/mashnoon33/cheflog">
          <Button variant="outline">
            <FiGithub className="h-4 w-4" />{" "}
          </Button>
        </Link>
      </div>
    </div>
  );
}
