import { Button } from "@/components/ui/button";
import { ContainerTextFlip } from "@/components/ui/text-flip";
import Link from "next/link";

export function TitleSection() {
    return (
        <div className="flex flex-col gap-4 w-full  text-center relative">
            <span className="text-sm w-full lg:text-lg md:text-lg font-bold text-neutral-700 absolute top-0 left-1/2 -translate-x-1/2 ">
                <ContainerTextFlip className="text-sm lg:text-lg md:text-lg text-blue-500" words={["versioned CMS", "language specification", "recipe editor"]} />
            </span>
            <h1 className="text-4xl md:text-6xl lg:mt-10 mt-8 font-bold">Recipes reimagined </h1>
            <p className="max-w-2xl mx-auto  text-neutral-700">
            A markdown-inspired recipe format, powerful text editor, and purpose-built CMS for collaboration, structure, and control.
            </p>
            <div className="flex flex-row gap-2 justify-center mt-5">
                <Link href="/admin">
                    <Button>Get Started</Button>
                </Link>
                <Link href="/public">
                    <Button variant="outline">Public cookbooks</Button>
                </Link>
            </div>
        </div>
    );
}