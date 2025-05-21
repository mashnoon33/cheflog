import { CircleDashed } from "lucide-react";

type LogoVariant = "small" | "medium" | "large";

const sizeMap = {
    small: {
        icon: "w-4 h-4",
        text: "text-lg",
        gap: "gap-0.5"
    },
    medium: {
        icon: "w-6 h-6",
        text: "text-2xl",
        gap: "gap-1"
    },
    large: {
        icon: "w-10 h-10",
        text: "text-4xl",
        gap: "gap-2"
    }
};

interface LogoProps {
    variant?: LogoVariant;
}

export function Logo({ variant = "medium" }: LogoProps) {
    const { icon, text, gap } = sizeMap[variant];
    return (
        <div className={`flex items-center justify-center ${gap}`}>
            <CircleDashed className={icon} />
            <h1 className={`${text} font-thin tracking-tight text-gray-900 animate-wave font-['Arial']`}>
                Cheflog
            </h1>
        </div>
    );
}