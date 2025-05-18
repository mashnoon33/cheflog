"use client"
import { useErrorStore } from '@/lib/stores/errorStore';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { register, validate } from './faux-language-server';

export interface RecipeEditorProps {
  initialValue?: string;
  onChange?: (value: string | undefined) => void;
  renderContext?: 'demo' | 'default';
}

export interface RecipeEditorRef {
  setValue: (value: string) => void;
}

export const RecipeEditor = forwardRef<RecipeEditorRef, RecipeEditorProps>(({ 
  initialValue,
  onChange,
  renderContext = 'default'
}, ref) => {
  const monaco = useMonaco();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const { clearErrors, setErrors } = useErrorStore();

  useImperativeHandle(ref, () => ({
    setValue: (value: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(value);
      }
    }
  }));

  useEffect(() => {
    if (monaco) {
      register(monaco);
    }
    // Reset errors when component mounts
    clearErrors();
  }, [monaco, clearErrors]);



  const handleEditorValidation = useCallback((markers: Monaco.editor.IMarker[]) => {
      if (!monaco || !editorRef.current) return;
      const model = editorRef.current.getModel();
      if (!model) return;
      // Update markers with our custom validation
      const problems = validate(monaco, model);
      monaco.editor.setModelMarkers(model, 'recipe', problems);
      // Count errors (only count Error severity, not Warning)
      setErrors(problems);
    }, [monaco, editorRef]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
    // Only trigger validation if we have a value and the editor is ready
    if (value && editorRef.current) {
      // Use requestAnimationFrame to debounce validation
      requestAnimationFrame(() => {
        handleEditorValidation([]);
      });
    }
  }, [onChange, handleEditorValidation]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (monaco ) {
      const timeout = setTimeout(() => {
        handleEditorValidation([]);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [monaco]);

  useEffect(() => {
    console.log('monaco', !!monaco);

    if (monaco) {
      console.log('setting theme', renderContext);
      monaco.editor.setTheme(renderContext === 'demo' ? 'demo-theme' : 'recipe-theme');
    }
  }, [monaco, renderContext]);


  return (
    <Editor
      className={`z-10 ${renderContext === 'default' ? 'h-screen' : 'h-[750px]'}`}
      defaultLanguage="recipe"
      defaultValue={initialValue}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        lineNumbers: 'on',
        fontSize: 14,
        wordWrap: 'on',
        renderWhitespace: 'none',
        scrollBeyondLastLine: false,
        padding: { top: 10, bottom: renderContext === 'demo' ? 0 : 200 },
        readOnly: renderContext === 'demo'
      }}
    />
  );
});

RecipeEditor.displayName = 'RecipeEditor';

export default RecipeEditor; 