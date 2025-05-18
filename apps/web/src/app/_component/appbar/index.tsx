import { CircleDashed } from "lucide-react";

export function AppBar() {
    return (<div className="container py-8 font-mono whitespace-pre mx-auto w-full">
        <div className="flex items-center justify-center gap-1">
            <CircleDashed className="w-6 h-6" />
            <h1 className=" text-2xl font-thin  tracking-tight text-gray-900 animate-wave font-['Arial']">
                Cheflog
            </h1>
        </div>
    </div>
    )
}