import { RecipeLanguageServerDependencies } from '../types';

/**
 * Register the recipe language configuration for Monaco
 */
export function registerLanguageConfiguration({ monaco }: RecipeLanguageServerDependencies): void {
  monaco.languages.register({ id: 'recipe' });

  // Define the recipe language syntax
  monaco.languages.setMonarchTokensProvider('recipe', {
    tokenizer: {
      root: [
        // YAML Frontmatter
        [/^---$/, 'recipe-frontmatter-delimiter'],
        [/^(short-description|short-url|yields|cuisine|blog)(:)(.*)$/, ['recipe-frontmatter-key', 'recipe-frontmatter-colon', 'recipe-frontmatter-value']],
        
        // Headers
        [/^#\s.*$/, 'recipe-header'],
        [/^==\s.*$/, 'recipe-section'],

        // Ingredients
        [/^-\s\[.*?\]/, 'recipe-quantity'],
        [/\*\(.*?\)\*/, 'recipe-description'],
        
        // Instructions
        [/^\d+\.\s/, 'recipe-step-number'],
      ]
    }
  });

  // Define the recipe language theme
  monaco.editor.defineTheme('recipe-theme', {
    base: 'vs',
    inherit: true,
    rules: [
      // Frontmatter
      { token: 'recipe-frontmatter-delimiter', foreground: '808080', fontStyle: 'bold' },
      { token: 'recipe-frontmatter-key', foreground: '0451A5', fontStyle: 'bold' },
      { token: 'recipe-frontmatter-colon', foreground: '0451A5' },
      { token: 'recipe-frontmatter-value', foreground: '098658' },
      { token: 'recipe-header', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'recipe-section', foreground: '569CD6' },
      { token: 'recipe-subsection', foreground: '569CD6' },
      { token: 'recipe-quantity', foreground: '4EC9B0' },
      { token: 'recipe-description', foreground: '608B4E', fontStyle: 'italic' },
      { token: 'recipe-step-number', foreground: 'CE9178' },
    ],
    colors: {
      'editor.background': '#f7f7f7',
    }
  });
  monaco.editor.setTheme('recipe-theme');

  monaco.languages.setLanguageConfiguration('recipe', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '*', close: '*' },
      { open: '`', close: '`' },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '*', close: '*' },
      { open: '`', close: '`' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    folding: {
      markers: {
        start: new RegExp("^\\s*//\\s*#?region\\b"),
        end: new RegExp("^\\s*//\\s*#?endregion\\b")
      }
    },
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  });
} 