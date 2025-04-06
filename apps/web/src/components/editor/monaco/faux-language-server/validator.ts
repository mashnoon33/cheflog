import { MarkerData, RecipeLanguageServerDependencies, TextModel } from './types';
import { validateFrontmatter, parseFrontmatter } from './frontmatter';

export function validateModel({ monaco }: RecipeLanguageServerDependencies, model: TextModel): MarkerData[] {
  const text = model.getValue();
  const lines = text.split('\n');
  const problems: MarkerData[] = [];
  
  // Validate frontmatter first
  const frontmatterProblems = validateFrontmatter(monaco, model);
  problems.push(...frontmatterProblems);
  
  // Get the frontmatter information to adjust line numbers for content validation
  const { hasFrontmatter, endLine } = parseFrontmatter(text);
  
  // Determine where the recipe content starts (after frontmatter or at beginning)
  const contentStartLine = hasFrontmatter ? endLine + 1 : 0;
  
  // Check for required sections
  let hasTitle = false;
  let hasIngredients = false;
  let hasInstructions = false;
  let currentSection = '';

  // Only validate content lines (skip frontmatter)
  const contentLines = lines.slice(contentStartLine);
  
  contentLines.forEach((line, relativeIndex) => {
    // Convert relative index to absolute line number for problem reporting
    const i = relativeIndex + contentStartLine;
    
    // Check title
    if (line.startsWith('# ')) {
      hasTitle = true;
    }
    
    // Check section headers
    if (line.trim().startsWith('== ')) {
      const sectionName = line.trim().substring(3).trim();
      if (sectionName.length === 0) {
        problems.push({
          severity: monaco.MarkerSeverity.Error,
          message: 'Section name cannot be empty',
          startLineNumber: i + 1,
          startColumn: 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1
        });
      }
      currentSection = sectionName;
    }

    // Validate ingredient format and track if we've found ingredients
    if (line.trim().startsWith('-')) {
      hasIngredients = true;
      const ingredientRegex = /^-\s*\[(.*?)\]/;
      if (!ingredientRegex.test(line)) {
        problems.push({
          severity: monaco.MarkerSeverity.Error,
          message: 'Invalid ingredient format. Use: - [amount unit] ingredient *(optional notes)*',
          startLineNumber: i + 1,
          startColumn: 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1
        });
      }
    }

    // Validate instruction format and track if we've found instructions
    if (/^\d+\./.test(line.trim())) {
      hasInstructions = true;
      const instructionRegex = /^\d+\.\s+.+/;
      if (!instructionRegex.test(line)) {
        problems.push({
          severity: monaco.MarkerSeverity.Error,
          message: 'Invalid instruction format. Use: 1. instruction text',
          startLineNumber: i + 1,
          startColumn: 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1
        });
      }
    }
  });

  // Add problems for missing required sections
  if (!hasTitle) {
    problems.push({
      severity: monaco.MarkerSeverity.Error,
      message: 'Recipe must have a title (# Title)',
      startLineNumber: contentStartLine + 1,
      startColumn: 1,
      endLineNumber: contentStartLine + 1,
      endColumn: 1
    });
  }

  if (!hasIngredients) {
    problems.push({
      severity: monaco.MarkerSeverity.Warning,
      message: 'Recipe should have at least one ingredient',
      startLineNumber: contentStartLine + 1,
      startColumn: 1,
      endLineNumber: contentStartLine + 1,
      endColumn: 1
    });
  }

  if (!hasInstructions) {
    problems.push({
      severity: monaco.MarkerSeverity.Warning,
      message: 'Recipe should have at least one instruction',
      startLineNumber: contentStartLine + 1,
      startColumn: 1,
      endLineNumber: contentStartLine + 1,
      endColumn: 1
    });
  }

  return problems;
} 