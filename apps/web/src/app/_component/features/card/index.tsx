"use client"
import { ForkRecipeModal } from "@/components/modals/fork-recipe-modal";
import { formatFractionDisplay } from "@/components/recipie/detail/ingredients/utils/render-ingedient-quanity";
import { Steps } from "@/components/recipie/detail/steps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActionContainer } from "@/components/ui/floating-action-button";
import { TwoItems, KeyValuePair } from "@/components/ui/kv";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { Scaler } from "@/components/ui/scaler";
import { Timer } from "@/components/ui/timer";
import { cn } from "@/lib/utils";
import { Link, Utensils, DiamondPercentIcon, Pencil, Star } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function FeaturesCard({ className }: { className?: string }) {
    return (
        <Card className={cn("h-[300px] w-full", className)}>
        </Card>
    );
}





export function TimerCard() {
    return (
        <Card className="w-full border-none relative overflow-hidden rounded-none">
            <div className="absolute bottom-0 right-0 p-4 blur-sm ">
                <Steps instructions={[
                    "Line a 10 1/2– by 5 1/2–inch loaf pan with a 9- by 13-inch sheet of parchment paper, or two 9- by 5-inch loaf pans with 7- by 13-inch sheets of parchment paper.",
                    "Adjust oven rack to lower-middle position and preheat to 350°F.",
                    "Peel bananas (for roughly 12 ounces or 340g fruit) and mash with Greek yogurt, eggs, and vanilla in a medium bowl.",
                    "If bananas are underripe, cover bowl with plastic and let mixture stand 30 minutes.",
                    "Combine flour, sugar, oat flour, baking powder, baking soda, salt, cinnamon, cloves, nutmeg, and coconut oil in the bowl of a stand mixer fitted with a paddle attachment.",
                    "Mix on low until coconut oil disappears into a mealy powder.",
                    "Add banana mash and continue mixing only until the floury bits disappear.",
                    "Fold in nuts with a flexible spatula, scrape into prepared pan(s), and spread into an even layer.",
                    "Bake until well risen and golden brown, or to an internal temperature of around 206°F (97°C), about [70 minutes] for a large loaf or 45 for small.",
                    "Wrapped tightly in foil, banana bread will keep up to 3 days at room temperature or 1 week in the fridge.",
                    "Serve with Banana Whipped Cream, if desired."
                ]} accum={1} />
            </div>
            <div className="absolute bottom-0 right-0 p-4">
                <div className="flex flex-col gap-2">
                    <Timer
                        id="timer"
                        label="Simmer carrots"
                        duration={1000000}
                        startTime={Date.now()}
                        onStop={() => { /* handle stop */ }}
                        onPause={() => { /* handle pause */ }}
                        onResume={() => { /* handle resume */ }}
                        onDelete={() => { /* handle delete */ }}
                        isRunning={true}
                    />
                    <Timer
                        id="timer"
                        label="Soy reduction"
                        duration={3000000}
                        startTime={Date.now()}
                        onStop={() => { /* handle stop */ }}
                        onPause={() => { /* handle pause */ }}
                        onResume={() => { /* handle resume */ }}
                        onDelete={() => { /* handle delete */ }}
                        isRunning={true}
                    />
                </div>
            </div>
        </Card>
    );
}

export function ScalingCard() {
    return (
        <Card className="w-full border-none relative overflow-hidden rounded-none">
            <div className="absolute bottom-0 right-0 p-4 blur-sm ">
                <Steps instructions={[
                    "Line a 10 1/2– by 5 1/2–inch loaf pan with a 9- by 13-inch sheet of parchment paper, or two 9- by 5-inch loaf pans with 7- by 13-inch sheets of parchment paper.",
                    "Adjust oven rack to lower-middle position and preheat to 350°F.",
                    "Peel bananas (for roughly 12 ounces or 340g fruit) and mash with Greek yogurt, eggs, and vanilla in a medium bowl.",
                    "If bananas are underripe, cover bowl with plastic and let mixture stand 30 minutes.",
                    "Combine flour, sugar, oat flour, baking powder, baking soda, salt, cinnamon, cloves, nutmeg, and coconut oil in the bowl of a stand mixer fitted with a paddle attachment.",
                    "Mix on low until coconut oil disappears into a mealy powder.",
                    "Add banana mash and continue mixing only until the floury bits disappear.",
                    "Fold in nuts with a flexible spatula, scrape into prepared pan(s), and spread into an even layer.",
                    "Bake until well risen and golden brown, or to an internal temperature of around 206°F (97°C), about [70 minutes] for a large loaf or 45 for small.",
                    "Wrapped tightly in foil, banana bread will keep up to 3 days at room temperature or 1 week in the fridge.",
                    "Serve with Banana Whipped Cream, if desired."
                ]} accum={1} />
            </div>
            <div className="absolute bottom-0 right-0 p-4">
                <Scaler
                    recipeId="demo"
                />
            </div>
        </Card>
    );
}

export function ProvenanceCard() {
    return (
        <Card className="w-full border-none relative overflow-hidden rounded-none">
            <div className="absolute bottom-0 right-0 p-4 blur-sm ">
                <Steps instructions={[
                    "Line a 10 1/2– by 5 1/2–inch loaf pan with a 9- by 13-inch sheet of parchment paper, or two 9- by 5-inch loaf pans with 7- by 13-inch sheets of parchment paper.",
                    "Adjust oven rack to lower-middle position and preheat to 350°F.",
                    "Peel bananas (for roughly 12 ounces or 340g fruit) and mash with Greek yogurt, eggs, and vanilla in a medium bowl.",
                    "If bananas are underripe, cover bowl with plastic and let mixture stand 30 minutes.",
                    "Combine flour, sugar, oat flour, baking powder, baking soda, salt, cinnamon, cloves, nutmeg, and coconut oil in the bowl of a stand mixer fitted with a paddle attachment.",
                    "Mix on low until coconut oil disappears into a mealy powder.",
                    "Add banana mash and continue mixing only until the floury bits disappear.",
                    "Fold in nuts with a flexible spatula, scrape into prepared pan(s), and spread into an even layer.",
                    "Bake until well risen and golden brown, or to an internal temperature of around 206°F (97°C), about [70 minutes] for a large loaf or 45 for small.",
                    "Wrapped tightly in foil, banana bread will keep up to 3 days at room temperature or 1 week in the fridge.",
                    "Serve with Banana Whipped Cream, if desired."
                ]} accum={1} />
            </div>
            <div className="absolute bottom-0 right-0 p-4">
            <ActionContainer>
                <div className="flex flex-col text-sm">
                    <div className="flex flex-row  text-neutral-400 text-xs mb-2">
                            <span className="">@carmen/bear</span>
                    </div>
                    {
                        true && (
                                <div className="flex flex-row gap-1 items-center text-xs text-neutral-400">
                                    <Utensils className="w-3 h-3" />
                                    Forked from
                                    <span className="text-xs text-white"> @eric/demo </span>
                                </div>
                        )
                    }
                    <TwoItems className="mt-4">
                        <KeyValuePair label="Created" value={format(new Date(), "MMM d, yyyy")} />
                        <KeyValuePair label="Updated" value={format(new Date(), "MMM d, yyyy")} />
                    </TwoItems>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                    <div className="flex flex-row gap-2 justify-end">
                        <NotificationBadge
                            label={formatFractionDisplay("1") ?? undefined}
                            show={false}
                        >
                            <Button
                                variant="muted"
                                size="sm"
                                onClick={() => {}}
                                disabled={false}
                            >
                                <DiamondPercentIcon className="h-4 w-4" />
                            </Button>
                        </NotificationBadge>
                        {false ? (
                            <Button
                                variant="muted"
                                onClick={() => {}}
                                size="sm"
                                disabled={false}
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="text-sm">Edit</span>
                            </Button>
                        ) : (
                            <Button
                                variant="muted"
                                onClick={() => {}}
                                size="sm"
                                disabled={false}
                            >
                                <Utensils className="h-3 w-3" />
                                <span className="text-sm">Fork</span>
                                 <Badge variant="secondary" className="bg-yellow-900 text-white">{3}</Badge>
                            </Button>
                        )}
                        <Button
                            variant="muted"
                            onClick={() => {}}
                            size="sm"
                            disabled={false}
                        >
                            <Star className={`h-4 w-4  ${true ? 'fill-yellow-500' : ''}`} />
                            <span className="text-sm">Star</span>
                            {true && <Badge variant="secondary" className="bg-yellow-900 text-white">{3}</Badge>}
                        </Button>
                    </div>
                </div>
            </ActionContainer>
            </div>
        </Card>
    );
}