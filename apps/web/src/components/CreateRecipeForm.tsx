"use client"
import RecipeEditor from '@/components/editor/monaco';
import { defaultRecipe } from '@/components/editor/monaco/const';
import { RecipeComponent } from '@/components/recipie';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import type { AppRouter } from '@/server/api/root';
import { api } from '@/trpc/react';
import { parseRecipe } from "@repo/parser";
import type { inferRouterOutputs } from '@trpc/server';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type RouterOutputs = inferRouterOutputs<AppRouter>;
type Recipe = RouterOutputs["recipe"]["getById"];

interface CreateRecipeFormProps {
    mode?: 'create' | 'edit';
    initialRecipe?: Recipe;
    blogId: string;
}

export function CreateRecipeForm({ mode = 'create', initialRecipe, blogId }: CreateRecipeFormProps) {
    const [recipe, setRecipe] = useState<string>(initialRecipe?.markdown ?? defaultRecipe);
    const utils = api.useUtils();
    const router = useRouter();

    const { mutate: createRecipe , isPending: isCreating } = api.recipe.create.useMutation({
        onSuccess: async (data) => {
            await utils.recipe.getAll.invalidate();
            toast.success("Recipe published successfully!");
            router.push(`/admin/${blogId}/${data.id}`);

        },
        onError: (error) => {
            toast.error(`Failed to publish recipe: ${error.message}`);
        }
    });

    const { mutate: updateRecipe , isPending: isUpdating } = api.recipe.update.useMutation({
        onSuccess: async (data) => {
            await utils.recipe.getAll.invalidate();
            toast.success("Recipe updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update recipe: ${error.message}`);
        }
    });

    
    const handlePublish = async () => {
        try {
            if (mode === 'edit' && initialRecipe) {
                await updateRecipe({ 
                    id: initialRecipe.id,
                    blogId: initialRecipe.blogId,
                    markdown: recipe,
                });
            } else {
                await createRecipe({ 
                    markdown: recipe,
                    blogId: blogId,
                });
            }
        } catch (error) {
        }
    };
    return (
        <ResizablePanelGroup direction="horizontal" className='h-full'>
            <ResizablePanel defaultSize={30}>
                {/* Editor Section */}
                <div className="h-screen flex flex-col ">
                    <RecipeEditor
                        initialValue={recipe}
                        onChange={(value: string | undefined) => setRecipe(value ?? '')}
                    />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
                {/* Preview Section */}
                <div className="h-screen flex-1 flex flex-col overflow-scroll p-6 bg-white">
                    <Button variant="outline" onClick={handlePublish}>Update</Button>
                <RecipeComponent recipe={parseRecipe(recipe)} version={initialRecipe?.version ?? 1} />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
} 