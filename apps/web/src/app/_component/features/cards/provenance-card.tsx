import { format } from "date-fns";
import { DiamondPercentIcon, Pencil, Star, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActionContainer } from "@/components/ui/floating-action-button";
import { KeyValuePair, TwoItems } from "@/components/ui/kv";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { formatFractionDisplay } from "@/components/recipie/detail/ingredients/utils/render-ingedient-quanity";
import { StepsOverlay } from "./shared";

export function ProvenanceCard() {
    // Demo data for provenance
    const created = format(new Date(), "MMM d, yyyy");
    const updated = format(new Date(), "MMM d, yyyy");
    const forkCount = 3;
    const starCount = 3;
    const isStarred = true;
    const showForked = true;
    const showEdit = false;

    return (
        <Card className="w-full border-none relative overflow-hidden rounded-none">
            <StepsOverlay />
            <div className="absolute bottom-0 right-0 p-4">
                <ActionContainer>
                    <div className="flex flex-col text-sm">
                        <div className="flex flex-row  text-neutral-400 text-xs mb-2">
                            <span>@carmen/bear</span>
                        </div>
                        {showForked && (
                            <div className="flex flex-row gap-1 items-center text-xs text-neutral-400">
                                <Utensils className="w-3 h-3" />
                                Forked from
                                <span className="text-xs text-white"> @eric/demo </span>
                            </div>
                        )}
                        <TwoItems className="mt-4">
                            <KeyValuePair label="Created" value={created} />
                            <KeyValuePair label="Updated" value={updated} />
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
                            {showEdit ? (
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
                                    <Badge variant="secondary" className="bg-yellow-900 text-white">{forkCount}</Badge>
                                </Button>
                            )}
                            <Button
                                variant="muted"
                                onClick={() => {}}
                                size="sm"
                                disabled={false}
                            >
                                <Star className={`h-4 w-4  ${isStarred ? 'fill-yellow-500' : ''}`} />
                                <span className="text-sm">Star</span>
                                {isStarred && <Badge variant="secondary" className="bg-yellow-900 text-white">{starCount}</Badge>}
                            </Button>
                        </div>
                    </div>
                </ActionContainer>
            </div>
        </Card>
    );
} 