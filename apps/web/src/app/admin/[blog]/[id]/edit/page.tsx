"use client"
import { CreateRecipeForm } from '@/components/CreateRecipeForm';
import { api } from '@/trpc/react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditRecipePage() {
    const params = useParams();
    const { data: recipe, isLoading } = api.recipe.getById.useQuery({ 
        id: params.id as string,
        blogId: params.blog as string
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    return <CreateRecipeForm mode="edit" initialRecipe={recipe} blogId={params.blog as string} />;
} 