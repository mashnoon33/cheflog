import { Card } from "@/components/ui/card";
import { Scaler } from "@/components/ui/scaler";
import { StepsOverlay } from "./shared";

export function ScalingCard() {
    return (
        <Card className="w-full border-none relative overflow-hidden rounded-none">
            <StepsOverlay />
            <div className="absolute bottom-0 right-0 p-4">
                <Scaler recipeId="demo" />
            </div>
        </Card>
    );
} 