import { type CompletionItem, type RecipeLanguageServerDependencies } from '../types';
import { RECIPE_SECTIONS, COMMON_UNITS } from '../constants';
import { parseFrontmatter } from '../validators/frontmatter';

/**
 * Register monaco completion providers for the recipe language
 */
export function registerCompletionProvider(
  { monaco }: RecipeLanguageServerDependencies,
): void {
  monaco.languages.registerCompletionItemProvider('recipe', {
    triggerCharacters: ['-', '=', ' ', '\n', ':'],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      const suggestions: CompletionItem[] = [];

      // Check if we're in the frontmatter section
      const { hasFrontmatter, startLine, endLine } = parseFrontmatter(model.getValue());
      const currentLine = position.lineNumber - 1; // Monaco is 1-indexed, our parser is 0-indexed
      
      if (hasFrontmatter && currentLine > startLine && currentLine < endLine) {
        // We're inside the frontmatter block
        if (textUntilPosition.trim() === '' || textUntilPosition.indexOf(':') === -1) {
          // Suggest frontmatter keys if we're at the start of a line or no colon yet
          suggestions.push(
            {
              label: 'blog',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'blog: ',
              range
            },
            {
              label: 'short-description',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'short-description: ',
              range
            },
            {
              label: 'short-url',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'short-url: ',
              range
            },
            {
              label: 'yields',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'yields: ',
              range
            },
            {
              label: 'cuisine',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'cuisine: ',
              range
            }
          );
        } 
      } else {
        // We're in the main content
        
        // Suggest section headers after double equals
        if (textUntilPosition.trim() === '==' || textUntilPosition.trim() === '== ') {
          RECIPE_SECTIONS.forEach(section => {
            suggestions.push({
              label: section,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: section,
              range
            });
          });
        }
        
        // Suggest units after dash or opening bracket
        if (textUntilPosition.trim().startsWith('-') || 
            textUntilPosition.includes('[')) {
          COMMON_UNITS.forEach(unit => {
            suggestions.push({
              label: unit,
              kind: monaco.languages.CompletionItemKind.Unit,
              insertText: unit,
              range
            });
          });
        }
      }

      return {
        suggestions
      };
    }
  });
} 