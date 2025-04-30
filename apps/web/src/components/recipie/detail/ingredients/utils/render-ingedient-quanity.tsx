"use client"

import React from 'react';
import type { Ingredient } from '@repo/parser';
import { useScaleStore } from '@/stores/scale-store';
import { RouterOutputs } from '@/trpc/react';
import { useParams } from 'next/navigation';
interface RenderIngredientQuantityProps {
  ingredient: Ingredient;
}

// Utility to convert decimal to a fraction string (e.g. 1.5 -> "1 1/2", 0.5 -> "1/2", 2 -> "2")
export function decimalToFraction(decimal: number, maxDenominator = 16): string {
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

// Helper to format fraction with sup/sub tags
export function formatFractionDisplay(fraction: string) {
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

export function RenderIngredientQuantity({
  ingredient,
}: RenderIngredientQuantityProps) {
  const params = useParams();
  const scale = useScaleStore<number>(
    (state) => state.scales[params.id as string] ?? 1
  );
  
  const quantity = Number(ingredient.quantity) * scale;
  const formattedQuantity = decimalToFraction(quantity);

  return (
    <div className="text-black/70 dark:text-white/70">
      {formatFractionDisplay(formattedQuantity)} {ingredient.displayUnit}
    </div>
  );
}