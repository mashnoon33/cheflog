import { Recipe } from "@repo/parser";
import { create } from "zustand";



interface RecipeStore {
  recipeMarkdown: string | null;
  setRecipeMarkdown: (recipeMarkdown: string | null) => void;
  clearRecipeMarkdown: () => void;
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipeMarkdown: null,
  setRecipeMarkdown: (recipeMarkdown) => set({ recipeMarkdown }),
  clearRecipeMarkdown: () => set({ recipeMarkdown: null }),
})); 