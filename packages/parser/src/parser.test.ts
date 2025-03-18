import { describe, it, expect } from 'vitest';
import { parseRecipe } from "./parser.js";

describe('parseRecipe', () => {
  it('should parse a basic recipe with sections', async () => {
    const markdown = `# Pancakes

A classic breakfast recipe for fluffy pancakes.

== Dry Ingredients
- [2 cups] all-purpose flour
- [2 tbsp] sugar
- [2 tsp] baking powder *(aluminum-free)*

== Wet Ingredients
- [2] eggs
- [1.5 cups] milk
- [1/4 cup] melted butter

== Instructions
1. Mix dry ingredients in a bowl
2. Whisk wet ingredients in another bowl
3. Combine wet and dry ingredients
4. Cook on a hot griddle until golden brown`;

    const recipe = await parseRecipe(markdown);

    expect(recipe.title).toBe("Pancakes");
    expect(recipe.description).toBe("A classic breakfast recipe for fluffy pancakes.");
    expect(recipe.sections.length).toBe(3);

    // Check Dry Ingredients section
    const drySection = recipe.sections[0];
    expect(drySection.title).toBe("Dry Ingredients");
    expect(drySection.ingredients.length).toBe(3);
    expect(drySection.ingredients[0]).toEqual({
      quantity: "2",
      unit: "cups",
      name: "all-purpose flour"
    });
    expect(drySection.ingredients[2]).toEqual({
      quantity: "2",
      unit: "tsp",
      name: "baking powder",
      description: "aluminum-free"
    });

    // Check Wet Ingredients section
    const wetSection = recipe.sections[1];
    expect(wetSection.title).toBe("Wet Ingredients");
    expect(wetSection.ingredients.length).toBe(3);
    expect(wetSection.ingredients[0]).toEqual({
      quantity: "2",
      unit: "unit",
      name: "eggs"
    });

    // Check Instructions section
    const instructionsSection = recipe.sections[2];
    expect(instructionsSection.title).toBe("Instructions");
    expect(instructionsSection.instructions.length).toBe(4);
    expect(instructionsSection.instructions[0]).toBe("Mix dry ingredients in a bowl");
  });
});