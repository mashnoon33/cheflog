import React from 'react';
import { renderEncodedString } from '../new/chips/encodings';

interface StepsProps {
  instructions: string[];
  accum: number;
}

export const Steps: React.FC<StepsProps> = ({ instructions, accum }) => {
  let currentAccum = accum;

  return (
    <div>
      {instructions.map((step, stepIndex) => (
        <div
          className="flex items-start gap-2"
          key={`${stepIndex}-${stepIndex}`}
        >
          <div className="bg-gray-100 dark:bg-neutral-800/20 border border-double border-gray-200 dark:border-neutral-800/40 rounded-full w-5 h-5 items-center text-center m-1 text-[11px] text-black/70 dark:text-white/70 font-bold flex-shrink-0">
            {currentAccum}
          </div>
          {renderEncodedString(step)} {!!currentAccum++}
        </div>
      ))}
    </div>
  );
}; 