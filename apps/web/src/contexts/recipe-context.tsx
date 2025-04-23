"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Recipe {
  title?: string;
  ingredients?: string[];
  instructions?: string[];
  url?: string;
  [key: string]: any;
}

interface RecipeContextType {
  recipe: Recipe | null;
  setRecipe: (recipe: Recipe | null) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  return (
    <RecipeContext.Provider value={{ recipe, setRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
} 