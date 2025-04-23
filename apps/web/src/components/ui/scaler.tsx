"use client";
import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { ActionContainer } from "./floating-action-button";
interface ScalerProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
}

export function Scaler({
  value,
  min = 1,
  max = 5,
  step = 1,
  onValueChange,
}: ScalerProps) {
  return (
    <ActionContainer>
        <div className="flex pr-2 flex-col gap-2">
            <span className="text-sm text-neutral-400">Scale</span>
            <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
        onValueChange={([v]) => onValueChange(v)}
        className="w-full"
      />
        </div>
       
       
       
    </ActionContainer>
  );
}

