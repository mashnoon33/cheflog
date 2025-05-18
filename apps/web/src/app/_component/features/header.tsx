export function FeatureHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col gap-2 w-full border-l-8 border-blue-500 pl-5">
            <h1 className="text-4xl font-bold text-blue-500">{title}</h1>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
}