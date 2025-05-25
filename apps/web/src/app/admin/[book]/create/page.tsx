"use client"
import { CreateRecipeForm } from '@/components/editor';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { defaultRecipe } from '@/components/editor/monaco/const';
import { api } from '@/trpc/react';
import { toRecipeMarkdown } from '@/types/scraper';
import { Loader2 } from 'lucide-react';

export default function CreatePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const book = params.book as string;
    const template = searchParams.get("template");
    const url = searchParams.get("url");
    const [initialRecipe, setInitialRecipe] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { mutate: scrapeRecipe } = api.scraper.scrapeRecipe.useMutation({
        onSuccess: (data) => {
            const markdown = toRecipeMarkdown(data);
            setInitialRecipe(markdown);
            setIsLoading(false);
        },
        onError: (error) => {
            console.error('Failed to scrape recipe:', error);
            setInitialRecipe(""); // Fallback to empty on error
            setIsLoading(false);
        },
    });

    useEffect(() => {
        if (template) {
            setInitialRecipe(defaultRecipe);
        } else if (url) {
            setIsLoading(true);
            scrapeRecipe({ url });
        } else {
            setInitialRecipe(""); // fallback to empty
        }
    }, [template, url, scrapeRecipe]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (initialRecipe === null) {
        return null;
    }

    return <CreateRecipeForm bookId={book} initialRecipe={initialRecipe} />;
}
