"use client";
import * as React from "react";
import { CustomStepSlider } from "./custom-step-slider";
import { ActionContainer } from "./floating-action-button";
import { Button } from "./button";
import { DiamondPercentIcon, Minus, RotateCcw, X } from "lucide-react";
import { useScaleStore } from "@/stores/scale-store";
const SCALE_STEPS = [0.125, 0.25, 0.33, 0.5, 1, 2, 3, 4];

interface ScalerProps {
    recipeId: string;
    strictSteps?: boolean;
}

export function Scaler({
    recipeId,
    strictSteps = true,
}: ScalerProps) {
    const { getScale, setScale, setShowScaler } = useScaleStore();
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
                        <button className={`text-xs text-yellow-500  p-1 rounded-full    ${value === 1 ? "opacity-50" : "hover:bg-neutral-100/20"}`} onClick={() => {
                            setScale(recipeId, 1);
                            setValue(1);
                            setShowScaler(false);
                        }} disabled={value === 1}>
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button className=" text-xs text-neutral-200 hover:bg-neutral-100/20 p-1 rounded-full" onClick={() => {
                            setShowScaler(false);
                        }}>
                            <Minus className="w-4 h-4" />
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

