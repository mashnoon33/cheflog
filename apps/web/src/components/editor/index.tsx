"use client"
import type { RecipeEditorRef } from "@/components/editor/monaco";
import RecipeEditor from '@/components/editor/monaco';
import { defaultRecipe } from '@/components/editor/monaco/const';
import { RecipeComponent } from '@/components/recipie/detail';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import type { AppRouter } from '@/server/api/root';
import { api } from '@/trpc/react';
import { toRecipeMarkdown } from "@/types/scraper";
import { parseRecipe } from "@repo/parser";
import type { inferRouterOutputs } from '@trpc/server';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { EditorFAB } from './monaco/fab';
import { FrontmatterType, parseFrontmatter } from "./monaco/faux-language-server/frontmatter";


interface CreateRecipeFormProps {
    mode?: 'create' | 'edit' | 'draft';
    initialRecipe?: string;
    bookId: string;
    id?: string;
}

export function CreateRecipeForm({ mode = 'create', initialRecipe, bookId, id }: CreateRecipeFormProps) {
    const [recipe, setRecipe] = useState<string>(initialRecipe ?? defaultRecipe);
    const [commitMessage, setCommitMessage] = useState<string>("");
    const editorRef = useRef<RecipeEditorRef>(null);
    const utils = api.useUtils();
    const router = useRouter();

    const { mutate: createRecipe, isPending: isCreating } = api.recipe.create.useMutation({
        onSuccess: async (data) => {
            await utils.recipe.getAll.invalidate();
            setCommitMessage("");
            toast.success("Recipe published successfully!");
            router.push(`/admin/${bookId}/${data.id}`);
        },
        onError: (error) => {
            toast.error(`Failed to publish recipe: ${error.message}`);
        }
    });

    const { mutate: updateRecipe, isPending: isUpdating } = api.recipe.update.useMutation({
        onSuccess: async (data) => {
            await utils.recipe.getAll.invalidate();
            setCommitMessage("");
            toast.success("Recipe updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update recipe: ${error.message}`);
        }
    });




    const handlePublish =  (draft: boolean = false) => {
        try {
            if ((mode === 'edit' || mode === 'draft') && initialRecipe && id) {
                updateRecipe({
                    id: id,
                    bookId: bookId,
                    markdown: recipe,
                    draft: draft,
                    commitMessage: commitMessage,
                });
            } else {
                createRecipe({
                    markdown: recipe,
                    bookId: bookId,
                    draft: draft,
                    commitMessage: commitMessage,
                });
            }
        } catch (error) {
        }
    };
    const primaryButtonText = (() => {
        switch (mode) {
            case 'create':
                return 'Publish';
            case 'edit':
                return 'Update';
            case 'draft':
                return 'Publish';
            default:
                return 'Publish';
        }
    })();

    const parsedRecipe = parseRecipe(recipe);
    const frontMatter = parseFrontmatter(recipe);
    const frontMatterToRecipeMetadata = (frontMatter: FrontmatterType) => {
        return {
            source: frontMatter.source,
        };
    };

    return (
        <ResizablePanelGroup direction="horizontal" className='h-full'>
            <ResizablePanel defaultSize={30}>
                {/* Editor Section */}
                <div className="h-screen flex flex-col ">
                    <RecipeEditor
                        ref={editorRef}
                        initialValue={recipe}
                        onChange={(value: string | undefined) => setRecipe(value ?? '')}
                    />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} >
                {/* Preview Section */}
                <div className="h-screen flex-1 flex flex-col overflow-scroll p-6 bg-white">
                    <RecipeComponent recipe={parsedRecipe}  recipeMetadata={frontMatterToRecipeMetadata(frontMatter.parsed)} />
                </div>
            </ResizablePanel>
            <EditorFAB
                onPublish={handlePublish}
                isCreating={isCreating}
                isUpdating={isUpdating}
                mode={mode}
                primaryButtonText={primaryButtonText}
                commitMessage={commitMessage}
                setCommitMessage={setCommitMessage}
            />
        </ResizablePanelGroup>
    );
}