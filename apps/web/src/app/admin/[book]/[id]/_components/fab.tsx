"use client"
import { FakeChart } from "@/components/fake/chart";
import { formatFractionDisplay } from "@/components/recipie/detail/ingredients/utils/render-ingedient-quanity";
import { Timers } from "@/components/recipie/detail/timers";
import { Button } from "@/components/ui/button";
import { ActionContainer } from "@/components/ui/floating-action-button";
import { KeyValuePair, TwoItems } from "@/components/ui/kv";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { RecipeOverlay } from "@/components/ui/recipe-overlay";
import { Scaler } from "@/components/ui/scaler";
import { useScaleStore } from "@/stores/scale-store";
import { api, RouterOutputs } from "@/trpc/react";
import { format } from "date-fns";
import { DiamondPercentIcon, Utensils } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Fab({ recipe }: { recipe: NonNullable<RouterOutputs["recipe"]["getById"]> }) {
    const [forkModalOpen, setForkModalOpen] = useState(false);
    const [isScalerVisible, setIsScalerVisible] = useState(false);
    const [scaleValue, setScaleValue] = useState(1);
    const { setShowScaler, getScale } = useScaleStore();
    const recipeId = recipe.id;

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

    useEffect(() => {
        setShowScaler(true);
        setScaleValue(getScale(recipeId));
        const unsubscribe = useScaleStore.subscribe((state) => {
            setIsScalerVisible(state.showScaler || (state.scales[recipeId] !== undefined && state.scales[recipeId] !== 1));
            setScaleValue(state.scales[recipeId] ?? 1);
        });
        return () => unsubscribe();
    }, [recipeId, setShowScaler, getScale]);

    return (
        <RecipeOverlay>
            <Timers recipeId={recipeId} />
            {isScalerVisible && <Scaler recipeId={recipeId} />}
            <ActionContainer>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-1 items-center text-sm">
                        <div className={`h-2 w-2 rounded-full ${recipe.draft ? "bg-yellow-500" : "bg-green-500"}`} />
                        <span className={`font-medium ${recipe.draft ? "text-yellow-500" : "text-green-500"}`}> {recipe.draft ? "Draft" : "Published"}</span>
                    </div>
                    <div className="text-xs text-neutral-400">
                        version {recipe.version}
                    </div>
                </div>
                {!recipe.draft && <FakeChart />}
                <div className="flex mt-2 flex-col gap-2  text-sm">
                    <KeyValuePair label="Slug" value={recipe.slug} />
                    <TwoItems>
                        <KeyValuePair label="Created" value={format(recipe.createdAt, "MMM d, yyyy")} />
                        <KeyValuePair label="Updated" value={format(recipe.updatedAt, "MMM d, yyyy")} />

                    </TwoItems>
                </div>
                {
                    recipe.forksFrom.length > 0 && (
                        <Link className="flex flex-row mt-4" href={`/${recipe.forksFrom[0]?.forkedFrom.bookId}/${recipe.forksFrom[0]?.forkedFrom.id}`}>
                            <div className="flex flex-row gap-1 items-center text-xs">
                                <Utensils className="w-3 h-3" />
                                Forked from
                                <span className="text-xs text-white"> @{recipe.forksFrom[0]?.forkedFrom.createdBy.handle}/{recipe.forksFrom[0]?.forkedFrom.bookId} </span>
                            </div>
                        </Link>
                    )
                }
                    <div className="mt-2 flex flex-row gap-2">
                    <NotificationBadge
                            label={formatFractionDisplay(scaleValue.toString()) ?? undefined}
                            show={scaleValue !== 1}
                        >
                            <Button
                                variant="muted"
                                size="sm"
                                onClick={() => setShowScaler(true)}
                                disabled={isScalerVisible}
                            >
                                <DiamondPercentIcon className="h-4 w-4" />
                            </Button>
                        </NotificationBadge>
                    </div>
            </ActionContainer>
        </RecipeOverlay>
    );
}