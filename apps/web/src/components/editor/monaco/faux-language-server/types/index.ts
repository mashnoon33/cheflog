import type * as Monaco from 'monaco-editor';
import { MonacoType } from '../../type';

export interface RecipeLanguageServerDependencies {
  monaco: MonacoType;
}

export type MarkerData = Monaco.editor.IMarkerData;
export type TextModel = Monaco.editor.ITextModel;
export type CompletionItem = Monaco.languages.CompletionItem; 