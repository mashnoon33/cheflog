export type Ingredient = {
  quantity: string;
  unit: string;
  displayUnit: string;
  name: string;
  description?: string;
};

export type RecipeSection = {
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
};

export type Recipe = {
  title: string;
  description: string;
  sections: RecipeSection[];
}; 