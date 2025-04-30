"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface CustomStepSliderProps extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'step' | 'min' | 'max' | 'value' | 'onValueChange'> {
  steps: number[]
  value: number
  onValueChange: (value: number) => void
  prefix?: string
  strictSteps?: boolean
}

// Helper to format fraction with sup/sub tags
function formatFractionDisplay(fraction: string) {
  if (!fraction.includes('/')) return fraction;

  const parts = fraction.split(' ');
  if (parts.length === 1) {
    // Simple fraction
    const [num, den] = parts[0]?.split('/') ?? [];
    return (
      <>
        <sup>{num}</sup>&frasl;<sub>{den}</sub>
      </>
    );
  } else {
    // Mixed number
    const [whole, frac] = parts;
    const [num, den] = frac?.split('/') ?? [];
    return (
      <>
        {whole} <sup>{num}</sup>&frasl;<sub>{den}</sub>
      </>
    );
  }
}

// Utility to convert decimal to a fraction string
function decimalToFraction(decimal: number, maxDenominator = 16): string {
  if (isNaN(decimal)) return '';
  if (decimal === 0) return '0';

  const isNegative = decimal < 0;
  decimal = Math.abs(decimal);

  const whole = Math.floor(decimal);
  const frac = decimal - whole;

  if (frac < 1e-6) {
    // It's an integer
    return (isNegative ? '-' : '') + whole.toString();
  }

  let bestNumerator = 1;
  let bestDenominator = 1;
  let minError = Math.abs(frac - bestNumerator / bestDenominator);

  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const numerator = Math.round(frac * denominator);
    const error = Math.abs(frac - numerator / denominator);
    if (error < minError && numerator <= denominator) {
      minError = error;
      bestNumerator = numerator;
      bestDenominator = denominator;
    }
    if (minError < 1e-6) break;
  }

  // If the fraction rounds to 0, just show the whole number
  if (bestNumerator === 0) {
    return (isNegative ? '-' : '') + whole.toString();
  }

  // If the fraction rounds to a whole, increment the whole
  if (bestNumerator === bestDenominator) {
    return (isNegative ? '-' : '') + (whole + 1).toString();
  }

  // If there's a whole number part, show as mixed number
  if (whole > 0) {
    return (isNegative ? '-' : '') + `${whole} ${bestNumerator}/${bestDenominator}`;
  }

  // Just the fraction
  return (isNegative ? '-' : '') + `${bestNumerator}/${bestDenominator}`;
}

export const CustomStepSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  CustomStepSliderProps
>(({ className, steps, value, onValueChange, prefix, strictSteps = true, ...props }, ref) => {
  // Find the closest step index to the current value
  const currentStepIndex = steps.reduce((closest, step, index) => {
    const currentDiff = Math.abs(step - value);
    const closestStep = steps[closest];
    if (typeof closestStep === 'undefined') return index;
    const closestDiff = Math.abs(closestStep - value);
    return currentDiff < closestDiff ? index : closest;
  }, 0);

  const handleValueChange = React.useCallback((values: number[]) => {
    const index = values[0];
    if (typeof index === 'number' && index >= 0 && index < steps.length) {
      const newValue = steps[index];
      if (typeof newValue === 'number') {
        onValueChange(newValue);
      }
    }
  }, [onValueChange, steps]);

  // If strictSteps is false, we'll use the raw value from the slider
  const handleRawValueChange = React.useCallback((values: number[]) => {
    const rawValue = values[0];
    if (typeof rawValue === 'number') {
      onValueChange(rawValue);
    }
  }, [onValueChange]);

  return (
    <div className="flex flex-col">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        min={strictSteps ? 0 : Math.min(...steps)}
        max={strictSteps ? steps.length - 1 : Math.max(...steps)}
        step={strictSteps ? 1 : undefined}
        value={strictSteps ? [currentStepIndex] : [value]}
        onValueChange={strictSteps ? handleValueChange : handleRawValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-5 w-full grow overflow-hidden rounded-full bg-neutral-600">
          <SliderPrimitive.Range className="absolute h-full bg-neutral-200" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      <div className="relative h-6 mt-2">
        {steps.map((step, i) => {
          const position = strictSteps 
            ? `${(i / (steps.length - 1)) * 100}%`
            : `${((step - Math.min(...steps)) / (Math.max(...steps) - Math.min(...steps))) * 100}%`;
          
          const formattedStep = formatFractionDisplay(decimalToFraction(step));
          
          return (
            <div
              key={i}
              className="absolute text-xs text-neutral-400 transform -translate-x-1/2"
              style={{ left: position }}
            >
              {prefix}{formattedStep}
            </div>
          );
        })}
      </div>
    </div>
  )
})

CustomStepSlider.displayName = "CustomStepSlider" 