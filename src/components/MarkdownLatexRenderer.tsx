import React from "react";
import { LatexMath } from "./LatexMath";

interface MarkdownLatexRendererProps {
  content: string;
}

export const MarkdownLatexRenderer: React.FC<MarkdownLatexRendererProps> = ({ content }) => {
  // Simple parser to find $...$ or $$...$$ and render via LatexMath
  const parts = [];
  const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.substring(lastIndex, match.index) });
    }
    const mathStr = match[0];
    const isBlock = mathStr.startsWith('$$');
    const inner = isBlock ? mathStr.slice(2, -2) : mathStr.slice(1, -1);
    parts.push({ type: 'latex', value: inner, block: isBlock });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.substring(lastIndex) });
  }

  return (
    <div className="whitespace-pre-wrap leading-relaxed space-y-2">
      {parts.map((part, idx) => {
        if (part.type === 'latex') {
          return <LatexMath key={idx} math={part.value} block={part.block} />;
        }
        return <span key={idx}>{part.value}</span>;
      })}
    </div>
  );
};
