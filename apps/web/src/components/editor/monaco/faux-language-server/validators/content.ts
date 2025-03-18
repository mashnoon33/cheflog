import { MarkerData, TextModel } from '../types';
import { MonacoType } from '../../type';
import { parseFrontmatter } from './frontmatter';
import { RECIPE_SECTIONS } from '../constants';

/**
 * Validates the recipe content structure
 */
export function validateContent(monaco: MonacoType, model: TextModel): MarkerData[] {
  const text = model.getValue();
  const lines = text.split('\n');
  const problems: MarkerData[] = [];
  
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
    if (line.trim().startsWith('==')) {
      const sectionName = line.trim().substring(2).trim();
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
      
      // Track required sections
      if (sectionName.toLowerCase() === 'ingredients') {
        hasIngredients = true;
      } else if (sectionName.toLowerCase() === 'instructions') {
        hasInstructions = true;
      }
    }
    
    // Check section content based on section type
    if (currentSection.toLowerCase() === 'ingredients') {
      // Ingredients should start with '-'
      if (line.trim() !== '' && !line.trim().startsWith('#') && !line.trim().startsWith('==') && !line.trim().startsWith('-')) {
        problems.push({
          severity: monaco.MarkerSeverity.Warning,
          message: 'Ingredient lines should start with "-"',
          startLineNumber: i + 1,
          startColumn: 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1
        });
      }
    }
    
    if (currentSection.toLowerCase() === 'instructions') {
      // Instructions should usually start with a number
      const trimmed = line.trim();
      if (trimmed !== '' && 
          !trimmed.startsWith('#') && 
          !trimmed.startsWith('==') && 
          !/^\d+\./.test(trimmed)) {
        problems.push({
          severity: monaco.MarkerSeverity.Info,
          message: 'Instruction lines typically start with a step number (e.g., "1.")',
          startLineNumber: i + 1,
          startColumn: 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1
        });
      }
    }
  });
  
  // Check for missing required sections
  if (!hasTitle) {
    problems.push({
      severity: monaco.MarkerSeverity.Error,
      message: 'Recipe must have a title (starts with "# ")',
      startLineNumber: contentStartLine + 1,
      startColumn: 1,
      endLineNumber: contentStartLine + 1,
      endColumn: 1
    });
  }
  
  if (!hasIngredients) {
    problems.push({
      severity: monaco.MarkerSeverity.Error,
      message: 'Recipe must have an Ingredients section',
      startLineNumber: contentStartLine + 1,
      startColumn: 1,
      endLineNumber: contentStartLine + 1,
      endColumn: 1
    });
  }
  
  if (!hasInstructions) {
    problems.push({
      severity: monaco.MarkerSeverity.Error,
      message: 'Recipe must have an Instructions section',
      startLineNumber: contentStartLine + 1,
      startColumn: 1,
      endLineNumber: contentStartLine + 1,
      endColumn: 1
    });
  }
  
  return problems;
} 