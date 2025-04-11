import { Shell } from "@/components/layout/public/shell";
export default function RecipesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className=" w-screen  flex flex-col h-screen ">
            <Shell>
                {children}
            </Shell>
        </div>)
}   