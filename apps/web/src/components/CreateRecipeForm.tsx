"use client"
import RecipeEditor from '@/components/editor/monaco';
import { defaultRecipe } from '@/components/editor/monaco/const';
import { RecipeComponent } from '@/components/recipie';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { parseRecipe } from "@repo/parser";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { parseFrontmatter } from '@/components/editor/monaco/faux-language-server/validators';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/trpc/react';
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { Shell } from '@/app/_components/shell';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';

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
                <Shell>
                {/* Preview Section */}
                <div className="h-[calc(100vh-67px)] flex-1 flex flex-row overflow-scroll p-6 bg-white">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <Tabs defaultValue="preview" className="w-full">
                            <div className='flex w-full justify-between'>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                                    <TabsTrigger value="json">JSON</TabsTrigger>
                                </TabsList>
                                <Button 
                                    onClick={handlePublish} 
                                    disabled={isCreating || isUpdating || !recipe.trim()}
                                >
                                    {isCreating || isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {mode === 'edit' ? 'Updating...' : 'Publishing...'}
                                        </>
                                    ) : (
                                        mode === 'edit' ? 'Update' : 'Publish'
                                    )}
                                </Button>
                            </div>
                            <TabsContent value="preview">
                                <RecipeComponent recipe={parseRecipe(recipe)} />
                            </TabsContent>
                            <TabsContent value="markdown">
                                <ReactMarkdown>{recipe}</ReactMarkdown>
                            </TabsContent>
                            <TabsContent value="json" className="w-full">
                                <div className='w-full overflow-x-auto'>
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(parseFrontmatter(recipe), null, 2)}</pre>
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(parseRecipe(recipe), null, 2)}</pre>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                </Shell>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
} 