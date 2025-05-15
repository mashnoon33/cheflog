export const defaultRecipe = `---
short-description: Learn how to write recipes in ChefLog format
yields: 1 recipe
cuisine: tutorial
slug: lemony-garlicky-miso-gochujang-brown-butter-gnocchi
---

# Lemony garlicky miso gochujang brown butter gnocchi

Hi there! This is a tutorial on how to write recipes in Cheflog. The syntax here is 
designed to be both human-readable and machine-parseable, making it easy to create beautiful, 
structured recipes. In order to achieve this, we are extended the markdown syntax with a few 
additional syntactical elements. All recipes start with frontmatter, which is a block of text 
between triple dashes. The frontmatter is used to store metadata about the recipe, such as the 
unique slug, yields, description for SEO, and cuisine. All optional. 

Each section of the recipe is prefixed with a \`==\` followed by the section name. The section name 
is a short title for the section, such as "Dry Ingredients" or "Baking".

== Gnocchi
- [2 cups] flour *(all-purpose)*
- [1 unit] ingredient *(comment/note)* !!
- [1 cup] double exclamation is *(important)* !!
- [1] egg !!
- [1/4 tsp] nutmeg *(freshly grated)*
- [1/4 cup] parmesan cheese *(freshly grated)*

1. Steps start with a number and a period
2. Steps always follow the ingredient list
3. Important ingredients are denoted with a double exclamation mark, they show up in recipe metadata
3. You can denote temperature in the step notes, temperatures are denoted with curly braces. E.g. {220°F}
4. You can denote time in the step notes, times are denoted with square brackets. E.g. [3 minutes]

== Sauce
- [2 tbsp] butter
- [2 cloves] garlic *(minced)*
- [1 tbsp] miso paste
- [1 tbsp] gochujang
- [1 tbsp] lemon juice
- [1/4 cup] pasta water
- [1/4 cup] parmesan cheese *(freshly grated)*

1. Melt butter in a large pan over medium heat
2. Add garlic and cook until fragrant, about [30 seconds]
3. Stir in miso paste and gochujang until combined
4. Add lemon juice and pasta water, stir to create a smooth sauce
5. Toss with cooked gnocchi and finish with parmesan

`;


