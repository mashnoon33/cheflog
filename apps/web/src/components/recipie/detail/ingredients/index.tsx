"use client";
import React, { useState } from "react";
import type { Ingredient } from "@repo/parser";
import { RenderIngredientQuantity } from "./utils/render-ingedient-quanity";

interface IngredientsProps {
  ingredients: Ingredient[];
}

export function Ingredients({ ingredients }: IngredientsProps) {
  return (
    <div className="py-1">
      {ingredients.map((ingredient, index) => (
        <Ingredient key={`${ingredient.name}`} ingredient={ingredient} />
      ))}
    </div>
  );
}

export function Ingredient({ ingredient }: { ingredient: Ingredient }) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div
      className={`min-w-1/2 flex flex-row justify-between border-b hover:cursor-pointer border-gray-300 px-4 py-2 last:border-none dark:border-neutral-300/10 ${isChecked ? 'opacity-20' : ''}`}
      key={`${ingredient.name}`}
      onClick={() => setIsChecked(!isChecked)}
    >
      <div className="flex font-medium">
        <div className="font-medium text-black dark:text-white">
          {ingredient.name}
        </div>
        {ingredient.description && (
          <div className="ml-2 text-black/50 dark:text-white/70">
            {ingredient.description}
          </div>
        )}
      </div>
      <RenderIngredientQuantity ingredient={ingredient} />
    </div>
  );
}
