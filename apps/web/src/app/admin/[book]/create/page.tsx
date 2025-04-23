"use client"
import { CreateRecipeForm } from '@/components/editor';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { defaultRecipe } from '@/components/editor/monaco/const';
import { api } from '@/trpc/react';
import { parseRecipe } from '@repo/parser';
import { useRecipeStore } from '@/stores/recipe-store';
export default function CreatePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const book = params.book as string;
    const template = searchParams.get("template");
    const url = searchParams.get("url");
    const recipeMarkdown = useRecipeStore((state) => state.recipeMarkdown);
    const [initialRecipe, setInitialRecipe] = useState<string | null>(null);

    useEffect(() => {
        if (template) {
            setInitialRecipe(defaultRecipe);
        } else if (url) {
           setInitialRecipe(recipeMarkdown ?? "");
        } else {
            setInitialRecipe(""); // fallback to empty
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template, url]);

    // Wait for initialRecipe to be set before rendering the form
    if (initialRecipe === null) {
        return null;
    }

    return <CreateRecipeForm bookId={book} initialRecipe={initialRecipe} />;
}
