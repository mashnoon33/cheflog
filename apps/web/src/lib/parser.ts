type Ingredient = {
    quantity: string;
    unit: string;
    name: string;
    description?: string;
  };
  
  type RecipeSection = {
    title: string;
    ingredients: Ingredient[];
    instructions: string[];
  };
  
  type Recipe = {
    title: string;
    description: string;
    sections: RecipeSection[];
  };
  
  export function parseRecipe(markdown: string): Recipe {
    const lines = markdown.split("\n");
  
    const recipe: Recipe = { title: "", description: "", sections: [] };
    let currentSection: RecipeSection | null = null;
  
    for (let line of lines) {
      line = line.trim();
  
      if (!line) continue;
  
      if (line.startsWith("# ")) {
        recipe.title = line.slice(2).trim();
        continue;
      }
  
      if (line.startsWith("== ")) {
        if (currentSection) recipe.sections.push(currentSection);
        currentSection = { title: line.slice(3).trim(), ingredients: [], instructions: [] };
        continue;
      }
  
      if (!recipe.description && !currentSection && !line.startsWith("-") && !/^\d+\./.test(line)) {
        recipe.description = line;
        continue;
      }
  
      if (!currentSection && (line.startsWith("-") || /^\d+\./.test(line))) {
        currentSection = { title: "Main", ingredients: [], instructions: [] };
      }
      if (line.startsWith("-")) {
        // Updated regex to make the description part optional
        const match = /- \[(.*?)\] ([^*]*)(?:\s*\*\((.*?)\)\*)?/.exec(line);
        if (match) {
          const [_, quantityUnit, name, description] = match;
          const [quantity, ...unitParts] = quantityUnit?.split(" ") ?? [];
          const unit = unitParts.join(" ");
  
          if (!currentSection) {
            currentSection = { title: "Main", ingredients: [], instructions: [] };
          }
  
          currentSection.ingredients.push({
            quantity: quantity ?? "",
            unit,
            name: name?.trim() ?? "",
            description: description ? description.trim() : undefined,
          });
        }
        continue;
      }
  
      if (/^\d+\./.test(line)) {
        if (!currentSection) {
          currentSection = { title: "Main", ingredients: [], instructions: [] };
        }
        currentSection.instructions.push(line.replace(/^\d+\.\s*/, ""));
      }
    }
  
    if (currentSection) recipe.sections.push(currentSection);
  
    if (recipe.sections.length === 0 && recipe.title) {
      recipe.sections.push({ title: "Main", ingredients: [], instructions: [] });
    }
  
    return recipe;
  }
  
