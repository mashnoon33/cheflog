import { MarkerData, TextModel, RecipeLanguageServerDependencies } from '../types';
import { validateFrontmatter } from './frontmatter';
import { validateContent } from './content';

/**
 * Main validation function that combines all validations
 */
export function validateModel(
  { monaco }: RecipeLanguageServerDependencies, 
  model: TextModel,
): MarkerData[] {
  const problems: MarkerData[] = [];
  
  // Validate frontmatter first
  const frontmatterProblems = validateFrontmatter(monaco, model);
  problems.push(...frontmatterProblems);
  
  // Validate content
  const contentProblems = validateContent(monaco, model);
  problems.push(...contentProblems);
  
  return problems;
}

export * from './frontmatter'; 