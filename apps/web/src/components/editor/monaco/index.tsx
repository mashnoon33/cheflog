"use client"
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import React, { useEffect, useRef } from 'react';
import { defaultRecipe } from './const';
import { register, validate } from './faux-language-server';

export interface RecipeEditorProps {
  initialValue?: string;
  onChange?: (value: string | undefined) => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({ 
  initialValue,
  onChange,
}) => {
  const monaco = useMonaco();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (monaco) {
      register(monaco);
    }
  }, [monaco]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorValidation = async (markers: Monaco.editor.IMarker[]) => {
    if (!monaco || !editorRef.current) return;
    
    const model = editorRef.current.getModel();
    if (!model) return;

    // Update markers with our custom validation
    const problems = await validate(monaco, model);
    monaco.editor.setModelMarkers(model, 'recipe', problems);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
    // Trigger validation on change
    handleEditorValidation([]);
  };

  return (
    <Editor
      className="h-screen z-10"
      defaultLanguage="recipe"
      defaultValue={initialValue}
      theme="recipe-theme"
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      onValidate={handleEditorValidation}
      options={{
        minimap: { enabled: false },
        lineNumbers: 'on',
        fontSize: 14,
        wordWrap: 'on',
        renderWhitespace: 'none',
        scrollBeyondLastLine: false,
        padding: { top: 10, bottom: 200 },
      }}
    />
  );
};

export default RecipeEditor; 