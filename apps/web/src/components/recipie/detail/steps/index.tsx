import React from 'react';
import { TimeBadge, TemperatureBadge } from './badges';

interface StepsProps {
  instructions: string[];
  accum: number;
}

// This regex matches [time] and {temperature} in the order they appear, as in the Monaco highlighter
const STEP_INLINE_REGEX = /(\[([^\]]+)\])|(\{([^}]+)\})/g;

export function Steps({ instructions, accum }: StepsProps) {
  let currentAccum = accum;

  return (
    <div>
      {instructions.map((step, stepIndex) => {
        const parts: (string | { type: 'time' | 'temperature', value: string })[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = STEP_INLINE_REGEX.exec(step)) !== null) {
          if (match.index > lastIndex) {
            parts.push(step.slice(lastIndex, match.index));
          }
          if (match[2]) {
            // match[2] is the content inside [ ]
            parts.push({ type: 'time', value: match[2] });
          } else if (match[4]) {
            // match[4] is the content inside { }
            parts.push({ type: 'temperature', value: match[4] });
          }
          lastIndex = STEP_INLINE_REGEX.lastIndex;
        }
        if (lastIndex < step.length) {
          parts.push(step.slice(lastIndex));
        }

        return (
          <div
            className="flex mt-2  gap-2"
            key={`${stepIndex}-${stepIndex}`}
          >
            <div className="bg-gray-100 dark:bg-neutral-800/20 border border-double border-gray-200 dark:border-neutral-800/40 rounded-full w-5 h-5 flex items-center justify-center text-[11px] text-black/70 dark:text-white/70 font-bold flex-shrink-0 m-1">
              {currentAccum}
            </div>
            <span>
              {parts.map((part, i) => {
                if (typeof part === 'string') {
                  return <React.Fragment key={i}>{part.trim()}</React.Fragment>;
                }
                if (part.type === 'time') {
                  return <TimeBadge key={i} value={part.value} />;
                }
                if (part.type === 'temperature') {
                  return <TemperatureBadge key={i} value={part.value} />;
                }4
                return null;
              })}
            </span>
            {!!currentAccum++}
          </div>
        );
      })}
    </div>
  );
} 