import React from 'react';

export const renderEncodedString = (text: string) => {
  // For now, just return the text as is
  // You can add more complex encoding/decoding logic here if needed
  return <span className="text-black/75 dark:text-white/75">{text}</span>;
}; 