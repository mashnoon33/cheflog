import React from 'react';
import type { Ingredient } from '@repo/parser';

interface RenderIngredientQuantityProps {
  ingredient: Ingredient;
  scaling?: number;
}

export const RenderIngredientQuantity: React.FC<RenderIngredientQuantityProps> = ({ 
  ingredient, 
  scaling = 1
}) => {
  const quantity = Number(ingredient.quantity) * scaling;
  
  // Convert decimal to fraction
  const getFraction = (decimal: number) => {
    const tolerance = 1.0E-6;
    let numerator = 1;
    let denominator = 1;
    let error = decimal - numerator / denominator;
    
    while (Math.abs(error) > tolerance && denominator < 16) {
      if (error > 0) {
        numerator++;
      } else {
        denominator++;
        numerator = Math.round(decimal * denominator);
      }
      error = decimal - numerator / denominator;
    }
    
    if (numerator === denominator) return "1";
    if (numerator === 0) return "0";
    if (denominator === 1) return numerator.toString();

    // Handle mixed numbers
    if (numerator > denominator) {
      const wholeNumber = Math.floor(numerator / denominator);
      const remainingNumerator = numerator % denominator;
      if (remainingNumerator === 0) {
        return wholeNumber.toString();
      }
      return `${wholeNumber} ${remainingNumerator}/${denominator}`;
    }
    
    return `${numerator}/${denominator}`;
  };
  const formattedQuantity = getFraction(quantity);
  
  // Helper to format fraction with sup/sub tags
  const formatFractionDisplay = (fraction: string) => {
    if (!fraction.includes('/')) return fraction;
    
    const parts = fraction.split(' ');
    if (parts.length === 1) {
      // Simple fraction
      const [num, den] = parts[0].split('/');
      return <>{num}<sup>{num}</sup>&frasl;<sub>{den}</sub></>;
    } else {
      // Mixed number
      const [whole, frac] = parts;
      const [num, den] = frac.split('/');
      return <>{whole} <sup>{num}</sup>&frasl;<sub>{den}</sub></>;
    }
  };

  return (
    <div className="text-black/70 dark:text-white/70">
      {formatFractionDisplay(formattedQuantity)} {ingredient.displayUnit}
    </div>
  );
};