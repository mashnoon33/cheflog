import { MonacoType } from '../type';
import { registerCompletionProvider } from './completion-provider';
import { registerLanguageConfiguration } from './language-config';
import { MarkerData, RecipeLanguageServerDependencies, TextModel } from './types';
import { validateModel } from './validator';

export function register(monaco: MonacoType): void {
  const dependencies: RecipeLanguageServerDependencies = { monaco };
  
  registerLanguageConfiguration(dependencies);
  registerCompletionProvider(dependencies);
}

export function validate(monaco: MonacoType, model: TextModel): MarkerData[] {
  return validateModel({ monaco }, model);
}