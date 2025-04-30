"use client";
import * as React from "react";
import { CustomStepSlider } from "./custom-step-slider";
import { ActionContainer } from "./floating-action-button";
import { Button } from "./button";
import { DiamondPercentIcon, RotateCcw, X } from "lucide-react";
import { useScaleStore } from "@/stores/scale-store";
const SCALE_STEPS = [0.125, 0.25, 0.5, 1, 2, 3, 4];

interface ScalerProps {
    recipeId: string;
    strictSteps?: boolean;
}

export function Scaler({
    recipeId,
    strictSteps = true,
}: ScalerProps) {
    const { toggleScaler, getScale, setScale } = useScaleStore();
    const [value, setValue] = React.useState(getScale(recipeId));

    // Update local state when scale changes
    React.useEffect(() => {
        setValue(getScale(recipeId));
    }, [recipeId, getScale]);

    const handleValueChange = React.useCallback((newValue: number) => {
        setValue(newValue);
        setScale(recipeId, newValue);
    }, [recipeId, setScale]);

    return (
        <ActionContainer>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 justify-between items-start">
                    <div className="flex flex-row gap-1 items-start">
                        <div className="text-sm text-neutral-400 pb-2 flex flex-row gap-1 items-center"> <DiamondPercentIcon className="w-4 h-4 text-neutral-400" /> Scale recipe</div>
                    </div>
                    <div className="flex gap-2 items-start">
                        <button className={`p-0 text-xs text-yellow-500 ${value === 1 ? "opacity-50" : ""}`} onClick={() => handleValueChange(1)} disabled={value === 1}>
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button className="p-0 text-xs text-neutral-200" onClick={() => {
                            toggleScaler();
                        }}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex px-3 w-full flex-col gap-2">
                    <CustomStepSlider
                        steps={SCALE_STEPS}
                        value={value}
                        onValueChange={handleValueChange}
                        strictSteps={strictSteps}
                    />
                </div>
            </div>
        </ActionContainer>
    );
}

