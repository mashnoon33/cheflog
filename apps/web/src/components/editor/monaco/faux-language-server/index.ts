import { MonacoType } from '../type';
import { MarkerData, RecipeLanguageServerDependencies, TextModel } from './types';
import { registerCompletionProvider } from './providers';
import { registerLanguageConfiguration } from './config';
import { validateModel } from './validators';

/**
 * Register the faux language server with Monaco
 */
export function register(monaco: MonacoType): void {
  const dependencies: RecipeLanguageServerDependencies = { monaco };
  registerLanguageConfiguration(dependencies);
  registerCompletionProvider(dependencies);
}

/**
 * Validate a text model using the faux language server
 */
export async function validate(monaco: MonacoType, model: TextModel): Promise<MarkerData[]> {
  return  validateModel({ monaco }, model);
}