"use client"
import { Pencil, Star, Utensils, Plus, DiamondPercentIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ActionContainer, FloatingActionButton } from "@/components/ui/floating-action-button";
import { RouterOutputs } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ForkRecipeModal } from "@/components/modals/fork-recipe-modal";
import { Timers } from "@/components/recipie/detail/timers";
import { TwoItems } from "@/components/ui/kv";
import { KeyValuePair } from "@/components/ui/kv";
import { format } from "date-fns";
import { RecipeOverlay } from "./recipe-overlay";
import { Scaler } from "@/components/ui/scaler";
export function Fab({ recipe }: { recipe: NonNullable<RouterOutputs["recipe"]["getById"]> }) {
    const [forkModalOpen, setForkModalOpen] = useState(false);
    const [scale, setScale] = useState(2);
    const [showScaler, setShowScaler] = useState(false);
    const { data: session, status } = useSession()
    const params = useParams();
    const router = useRouter();
    const { data: stars } = api.recipe.getStars.useQuery({ id: recipe.id, bookId: params.book as string })
    const utils = api.useUtils()
    const { mutate: star } = api.recipe.star.useMutation({
        onSuccess: () => {
            utils.recipe.getStars.invalidate({ id: recipe.id, bookId: recipe.bookId })
        }
    })
    const { mutate: unstar } = api.recipe.unstar.useMutation({
        onSuccess: () => {
            utils.recipe.getStars.invalidate({ id: recipe.id, bookId: recipe.bookId })
        }
    })

    const isOwner = recipe.createdBy.id === session?.user.id
    const hasStarred = stars?.some(s => s.userId === session?.user.id)

    const handleEdit = () => {
        router.push(`/admin/${recipe.bookId}/${recipe.id}/edit`)
    }

    const handleFork = () => {
        setForkModalOpen(true)
    }

    const handleStar = () => {
        if (hasStarred) {
            unstar({ id: recipe.id, bookId: recipe.bookId })
        } else {
            star({ id: recipe.id, bookId: recipe.bookId })
        }
    }

    if (status !== "authenticated") {
        return null
    }

    return (
        <RecipeOverlay>
            <Timers recipeId={recipe.id} />
            {showScaler && <Scaler value={scale} onValueChange={setScale} />}
            <ActionContainer>

                <div className="flex flex-col  mb-4 text-sm">
                    <div className="flex flex-row  text-neutral-400 text-sm mb-2">
                        <Link href={`/${recipe.bookId}`}>
                            <span className="">@{recipe.createdBy.handle}/{recipe.bookId}</span>
                        </Link>
                    </div>
                    <TwoItems>
                        <KeyValuePair label="Created" value={format(recipe.createdAt, "MMM d, yyyy")} />
                        <KeyValuePair label="Updated" value={format(recipe.updatedAt, "MMM d, yyyy")} />
                    </TwoItems>

                </div>
                <div className="flex flex-col gap-2">

                    <div className="flex flex-row gap-2 justify-end">
                        <Button variant="muted" size="sm" onClick={() => setShowScaler(!showScaler)} disabled={showScaler}>
                            <DiamondPercentIcon className="h-4 w-4" />
                        </Button>
                        {isOwner ? (
                            <Button
                                variant="muted"
                                onClick={handleEdit}
                                size="sm"
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="text-sm">Edit</span>
                            </Button>
                        ) : (
                            <Button
                                variant="muted"
                                onClick={handleFork}
                                size="sm"
                            >
                                <Utensils className="h-3 w-3" />
                                <span className="text-sm">Fork</span>
                                {recipe.forksTo.length > 0 && <Badge variant="secondary" className="bg-yellow-900 text-white">{recipe.forksTo.length}</Badge>}
                            </Button>
                        )}
                        <Button
                            variant="muted"
                            onClick={handleStar}
                            size="sm"
                        >
                            <Star className={`h-4 w-4  ${hasStarred ? 'fill-yellow-500' : ''}`} />
                            <span className="text-sm">Star</span>
                            {!!stars?.length && <Badge variant="secondary" className="bg-yellow-900 text-white">{stars.length}</Badge>}
                        </Button>
                    </div>
                </div>
                <ForkRecipeModal recipeId={recipe.id} forkedFromBookId={params.book as string} open={forkModalOpen} onOpenChange={setForkModalOpen} />
            </ActionContainer>
        </RecipeOverlay>
    );
}