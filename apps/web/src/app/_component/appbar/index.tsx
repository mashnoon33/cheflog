import { Logo } from "@/components/ui/logo";


export function AppBar() {
    return (<div className="container py-8 font-mono whitespace-pre mx-auto w-full">
        <div className="flex items-center justify-center gap-1">
            <Logo variant="medium" />
        </div>
    </div>
    )
}