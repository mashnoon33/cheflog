import React from 'react';

interface CuisineTextProps {
  cuisine: string;
}

export const CuisineText: React.FC<CuisineTextProps> = ({ cuisine }) => {
  return (
    <div className="text-sm text-black/50 dark:text-white/70 mb-2">
      {cuisine}
    </div>
  );
}; 