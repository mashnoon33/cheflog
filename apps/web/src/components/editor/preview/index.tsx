import React from 'react';
import ReactMarkdown from 'react-markdown';

interface PreviewProps {
  markdown: string;
}

const Preview: React.FC<PreviewProps> = ({ markdown }) => {
  return (
    <div className="markdown-preview">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default Preview;
