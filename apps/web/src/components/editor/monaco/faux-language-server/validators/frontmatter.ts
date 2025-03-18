import { MonacoType } from '../../type';
import { MarkerData, TextModel } from '../types';
import { z } from 'zod';
import yaml from 'yaml';

// Define the frontmatter schema using Zod
export const frontmatterSchema = z.object({
  'short-description': z.string().optional(),
  'short-url': z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a dash-separated string with no spaces').optional(),
  'yields': z.string().optional(),
  'cuisine': z.union([
    z.array(z.string()),
    z.string()
  ]).optional(),
}).strict();

// Type for frontmatter derived from Zod schema
export type FrontmatterType = z.infer<typeof frontmatterSchema>;

// Result type for frontmatter parsing
export interface FrontmatterParseResult {
  raw: Record<string, any>;
  parsed: FrontmatterType;
  hasFrontmatter: boolean;
  startLine: number;
  endLine: number;
}

/**
 * Extracts frontmatter data using YAML parser
 */
const extractFrontmatterData = (
  lines: string[], 
  startLine: number, 
  endLine: number
): Record<string, any> => {
  const yamlContent = lines.slice(startLine + 1, endLine).join('\n');
  try {
    return yaml.parse(yamlContent) || {};
  } catch (error) {
    return {};
  }
};

/**
 * Parse frontmatter from text
 */
export const parseFrontmatter = (text: string): FrontmatterParseResult => {
  const lines = text.split('\n');
  let raw: Record<string, any> = {};
  let parsed: FrontmatterType = {};
  let hasFrontmatter = false;
  let startLine = -1;
  let endLine = -1;

  // Check if text starts with frontmatter delimiter
  if (lines.length > 2 && lines[0] === '---') {
    // Find the closing frontmatter delimiter
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        hasFrontmatter = true;
        startLine = 0;
        endLine = i;
        break;
      }
    }

    // Extract and parse frontmatter data if found
    if (hasFrontmatter) {
      raw = extractFrontmatterData(lines, startLine, endLine);
      
      // Validate frontmatter against the schema
      const result = frontmatterSchema.safeParse(raw);
      if (result.success) {
        parsed = result.data;
      }
    }
  }

  return {
    raw,
    parsed,
    hasFrontmatter,
    startLine,
    endLine
  };
};

/**
 * Validate frontmatter keys
 */
const validateFrontmatterKeys = (
  monaco: MonacoType,
  lines: string[],
  startLine: number,
  endLine: number
): MarkerData[] => {
  const problems: MarkerData[] = [];
  
  // Check each line for valid frontmatter key format
  for (let i = startLine + 1; i < endLine; i++) {
    const line = lines[i];
    if (!line || line.trim() === '') continue;
    
    // Check if the line has a key-value format
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      problems.push({
        severity: monaco.MarkerSeverity.Error,
        message: 'Invalid frontmatter format: missing colon',
        startLineNumber: i + 1,
        startColumn: 1,
        endLineNumber: i + 1,
        endColumn: line.length + 1
      });
      continue;
    }
    
    // Check if the key is valid
    const key = line.substring(0, colonIndex).trim();
    if (!Object.keys(frontmatterSchema.shape).includes(key)) {
      problems.push({
        severity: monaco.MarkerSeverity.Warning,
        message: `Unknown frontmatter key: '${key}'`,
        startLineNumber: i + 1,
        startColumn: 1,
        endLineNumber: i + 1,
        endColumn: colonIndex + 1
      });
    }
  }
  
  return problems;
};

/**
 * Map Zod validation errors to Monaco markers
 */
const mapZodErrorsToMarkers = (
  monaco: MonacoType,
  result: z.SafeParseError<any>,
  lines: string[],
  startLine: number,
  endLine: number
): MarkerData[] => {
  const problems: MarkerData[] = [];
  
  result.error.errors.forEach(error => {
    const path = error.path.join('.');
    
    // Find the line with this key
    for (let i = startLine + 1; i < endLine; i++) {
      const line = lines[i];
      if (!line) continue;
      
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      if (key === path || path === '') {
        problems.push({
          severity: monaco.MarkerSeverity.Error,
          message: error.message,
          startLineNumber: i + 1,
          startColumn: colonIndex + 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1
        });
        break;
      }
    }
  });
  
  return problems;
};

/**
 * Validate frontmatter in the model
 */
export const validateFrontmatter = (
  monaco: MonacoType, 
  model: TextModel
): MarkerData[] => {
  const text = model.getValue();
  const lines = text.split('\n');
  const problems: MarkerData[] = [];
  
  const { hasFrontmatter, startLine, endLine, raw } = parseFrontmatter(text);
  
  if (!hasFrontmatter) {
    return [];
  }
  
  // Check frontmatter key formats
  const keyProblems = validateFrontmatterKeys(monaco, lines, startLine, endLine);
  problems.push(...keyProblems);
  
  // Validate against the schema
  const result = frontmatterSchema.safeParse(raw);
  if (!result.success) {
    const zodProblems = mapZodErrorsToMarkers(monaco, result, lines, startLine, endLine);
    problems.push(...zodProblems);
  }
  
  return problems;
}; 