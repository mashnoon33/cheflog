"use client";
import { ForkRecipeModal } from "@/components/modals/fork-recipe-modal";
import { Timers } from "@/components/recipie/detail/timers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActionContainer } from "@/components/ui/floating-action-button";
import { KeyValuePair, TwoItems } from "@/components/ui/kv";
import { Scaler } from "@/components/ui/scaler";
import { useScaleStore } from "@/stores/scale-store";
import { api, RouterOutputs } from "@/trpc/react";
import { format } from "date-fns";
import { DiamondPercentIcon, Pencil, Star, Utensils } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { formatFractionDisplay } from "@/components/recipie/detail/ingredients/utils/render-ingedient-quanity";
import { RecipeOverlay } from "@/components/ui/recipe-overlay";
import { useIsMobile } from "@/hooks/use-mobile";
export function Fab({
  recipe,
}: {
  recipe: NonNullable<RouterOutputs["recipe"]["getById"]>;
}) {
  const [forkModalOpen, setForkModalOpen] = useState(false);
  const [isScalerVisible, setIsScalerVisible] = useState(false);
  const [scaleValue, setScaleValue] = useState(1);
  const { setShowScaler, getScale } = useScaleStore();
  const isMobile = useIsMobile();

  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;

  const { data: stars } = api.recipe.getStars.useQuery({
    id: recipe.id,
    bookId: params.book as string,
  });
  const utils = api.useUtils();
  const { mutate: star } = api.recipe.star.useMutation({
    onSuccess: () => {
      utils.recipe.getStars.invalidate({
        id: recipe.id,
        bookId: recipe.bookId,
      });
    },
  });
  const { mutate: unstar } = api.recipe.unstar.useMutation({
    onSuccess: () => {
      utils.recipe.getStars.invalidate({
        id: recipe.id,
        bookId: recipe.bookId,
      });
    },
  });

  const isOwner = recipe.createdBy.id === session?.user.id;
  const hasStarred = stars?.some((s) => s.userId === session?.user.id);

  const handleEdit = () => {
    router.push(`/admin/${recipe.bookId}/${recipe.id}/edit`);
  };

  const handleFork = () => {
    setForkModalOpen(true);
  };

  const handleStar = () => {
    if (hasStarred) {
      unstar({ id: recipe.id, bookId: recipe.bookId });
    } else {
      star({ id: recipe.id, bookId: recipe.bookId });
    }
  };

  useEffect(() => {
    setShowScaler(true);
    setScaleValue(getScale(recipeId));
    const unsubscribe = useScaleStore.subscribe((state) => {
      setIsScalerVisible(
        state.showScaler ||
          (state.scales[recipeId] !== undefined &&
            state.scales[recipeId] !== 1),
      );
      setScaleValue(state.scales[recipeId] ?? 1);
    });
    return () => unsubscribe();
  }, [recipeId, setShowScaler, getScale]);

  return (
    <>
      <RecipeOverlay>
        <Timers recipeId={recipeId} />
      </RecipeOverlay>
      <RecipeOverlay renderContext={isMobile ? "inline" : "default"}>
        {!isMobile && <Timers recipeId={recipeId} />}
        {isScalerVisible && <Scaler recipeId={recipeId} />}
        <ActionContainer>
          <div className="flex flex-col text-sm">
            <div className="mb-2 flex flex-row text-xs text-neutral-400">
              <Link href={`/${recipe.bookId}`}>
                <span className="">
                  @{recipe.createdBy.handle}/{recipe.bookId}
                </span>
              </Link>
            </div>
            {recipe.forksFrom.length > 0 && (
              <Link
                className="flex flex-row text-neutral-400"
                href={`/${recipe.forksFrom[0]?.forkedFrom.bookId}/${recipe.forksFrom[0]?.forkedFrom.id}`}
              >
                <div className="flex flex-row items-center gap-1 text-xs">
                  <Utensils className="h-3 w-3" />
                  Forked from
                  <span className="text-xs text-white">
                    {" "}
                    @{recipe.forksFrom[0]?.forkedFrom.createdBy.handle}/
                    {recipe.forksFrom[0]?.forkedFrom.bookId}{" "}
                  </span>
                </div>
              </Link>
            )}
            <TwoItems className="mt-4">
              <KeyValuePair
                label="Created"
                value={format(recipe.createdAt, "MMM d, yyyy")}
              />
              <KeyValuePair
                label="Updated"
                value={format(recipe.updatedAt, "MMM d, yyyy")}
              />
            </TwoItems>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex flex-row justify-end gap-2">
              <NotificationBadge
                label={
                  formatFractionDisplay(scaleValue.toString()) ?? undefined
                }
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
              {isOwner ? (
                <Button
                  variant="muted"
                  onClick={handleEdit}
                  size="sm"
                  disabled={status !== "authenticated"}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </Button>
              ) : (
                <Button
                  variant="muted"
                  onClick={handleFork}
                  size="sm"
                  disabled={status !== "authenticated"}
                >
                  <Utensils className="h-3 w-3" />
                  <span className="text-sm">Fork</span>
                  {recipe.forksTo.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-900 text-white"
                    >
                      {recipe.forksTo.length}
                    </Badge>
                  )}
                </Button>
              )}
              <Button
                variant="muted"
                onClick={handleStar}
                size="sm"
                disabled={status !== "authenticated"}
              >
                <Star
                  className={`h-4 w-4 ${hasStarred ? "fill-yellow-500" : ""}`}
                />
                <span className="text-sm">Star</span>
                {!!stars?.length && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-900 text-white"
                  >
                    {stars.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          <ForkRecipeModal
            recipeId={recipe.id}
            forkedFromBookId={params.book as string}
            open={forkModalOpen}
            onOpenChange={setForkModalOpen}
          />
        </ActionContainer>
      </RecipeOverlay>
    </>
  );
}
