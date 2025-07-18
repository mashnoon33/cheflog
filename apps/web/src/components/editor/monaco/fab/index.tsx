"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Textarea } from "@/components/ui/textarea";
import { useErrorStore } from "@/stores/errorStore";
import { Loader2 } from "lucide-react";
import { MarkerSeverity } from 'monaco-editor'

interface EditorFABProps {
  onPublish: (draft?: boolean) => void;
  isCreating: boolean;
  isUpdating: boolean;
  mode: 'create' | 'edit' | 'draft';
  primaryButtonText: string;
  commitMessage: string;
  setCommitMessage: (commitMessage: string) => void;
}

export function EditorFAB({
  onPublish,
  isCreating,
  isUpdating,
  mode,
  primaryButtonText,
  commitMessage,
  setCommitMessage
}: EditorFABProps) {
  const { errors } = useErrorStore();

  return (
    <FloatingActionButton>
      <div className='flex flex-col gap-2'>
        <div className="flex flex-row gap-1 items-center text-sm mb-2">
          <div className={`h-2 w-2 rounded-full ${errors.length > 0 ? "bg-red-500" : "bg-green-500"}`} />
          <span className={`font-medium ${errors.length > 0 ? "text-red-500" : "text-green-500"}`}>
            {errors.length > 0 ? 'Problems' : 'Valid Recipe'}
          </span>
          {errors.length > 0 && (
            <Badge variant="destructive"  className="text-xs  rounded-full ">
              {errors.length}
            </Badge>
          )}
        </div>
        {errors.length > 0 && (
          <div className="flex flex-col gap-2 text-xs text-white font-mono mb-2">
            {errors.map((error) => (
              <div key={error.message} className={` border-l-2 pl-1 text-white/80 ${error.severity === 8 ? "border-red-500" : "border-yellow-500"}`}>
                {error.startLineNumber ? `${error.startLineNumber}: ` : ''}{error.message}
              </div>
            ))}
          </div>
        )}
        <Textarea
          placeholder="Commit Message"
          value={commitMessage}
          onChange={(e) => {
            const value = e.target.value;
            setCommitMessage(value);
          }}
          className="w-full bg-neutral-800 text-white border-white/10"
        />
        <div className='flex flex-row gap-2 justify-end'>
          <Button 
            variant="default" 
            className='bg-green-700 hover:bg-green-600' 
            onClick={() => onPublish()}
            disabled={isCreating || isUpdating || errors.filter(error => error.severity === 8).length > 0}
            size="sm"
          >
            {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {primaryButtonText}
          </Button>
          {(mode === 'create' || mode === 'draft') && (
            <Button 
              variant="outline" 
              onClick={() => onPublish(true)}
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Draft' : 'Update Draft'}
            </Button>
          )}
        </div>
      </div>
    </FloatingActionButton>
  );
}
