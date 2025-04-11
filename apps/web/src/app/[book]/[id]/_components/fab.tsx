"use client"
import { Link, Pencil, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { RouterOutputs } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
export function Fab({ recipe }: { recipe: NonNullable<RouterOutputs["recipe"]["getById"]> }) {
    const { data: session } = useSession()
    const {mutate: star} = api.recipe.star.useMutation()
    const isOwner = recipe.createdBy.id === session?.user.id
    return (<FloatingActionButton className="" >
        <div className="flex flex-row gap-2">
            {
                isOwner && (
                    <Button
                        variant="outline"
                        onClick={() => window.open(`/admin/${recipe.bookId}/${recipe.id}`, '_blank')}
                    >
                        <Pencil className="h-4 w-4" />
                        <span className="text-sm">Edit</span>
                    </Button>
                )}
            {
                !isOwner && <Button
                    variant="outline"
                    onClick={() => window.open(`/admin/${recipe.bookId}/${recipe.id}/fork`, '_blank')}
                >
                    <Link className="h-4 w-4" />
                    <span className="text-sm">Fork</span>
                </Button>
            }
            <Button
                variant="outline"
                onClick={() => star({ id: recipe.id, bookId: recipe.bookId })}
            >
                <Star className="h-4 w-4" />
                <span className="text-sm">{recipe.stars?.length}</span>
            </Button>
        </div>
    </FloatingActionButton>
    );
}