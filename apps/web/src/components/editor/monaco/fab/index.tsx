"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useErrorStore } from "@/lib/stores/errorStore";
import { Loader2 } from "lucide-react";

interface EditorFABProps {
  onPublish: (draft?: boolean) => void;
  isCreating: boolean;
  isUpdating: boolean;
  mode: 'create' | 'edit' | 'draft';
  primaryButtonText: string;
}

export function EditorFAB({
  onPublish,
  isCreating,
  isUpdating,
  mode,
  primaryButtonText
}: EditorFABProps) {
  const { errors } = useErrorStore();

  return (
    <FloatingActionButton>
      <div className='flex flex-col gap-2'>
        <div className="flex flex-row gap-1 items-center text-sm mb-2">
          <div className={`h-2 w-2 rounded-full ${errors.length > 0 ? "bg-red-500" : "bg-green-500"}`} />
          <span className={`font-medium ${errors.length > 0 ? "text-red-500" : "text-green-500"}`}>
            {errors.length > 0 ? 'Validation Errors' : 'No Validation Errors'}
          </span>
          {errors.length > 0 && (
            <Badge variant="destructive"  className="text-xs  rounded-full ">
              {errors.length}
            </Badge>
          )}
        </div>
        {errors.length > 0 && (
          <div className="flex flex-col gap-2 text-xs text-white font-mono">
            {errors.map((error) => (
              <div key={error.message}>
                {error.startLineNumber ? `Line ${error.startLineNumber}: ` : ''}{error.message}
              </div>
            ))}
          </div>
        )}
        <div className='flex flex-row gap-2 justify-end'>
          <Button 
            variant="default" 
            className='bg-green-700 hover:bg-green-600' 
            onClick={() => onPublish()}
            disabled={isCreating || isUpdating || errors.length > 0}
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
