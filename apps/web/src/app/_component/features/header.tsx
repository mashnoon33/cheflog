export function FeatureHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col gap-2 w-full border-l-8 border-blue-700 pl-5">
            <h1 className="text-4xl font-bold text-blue-800 max-w-sm">
                {title}
            </h1>
            <p className="text-sm text-blue-800/70 max-w-md">
                {description}
            </p>
        </div>
    );
}