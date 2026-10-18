import React from "react";
import katex from "katex";

interface LatexMathProps {
  math: string;
  block?: boolean;
}

export const LatexMath: React.FC<LatexMathProps> = ({ math, block = false }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false,
    });
    return (
      <span
        dangerouslySetInnerHTML={{ __html: html }}
        className={`inline-block ${block ? 'my-2 overflow-x-auto max-w-full' : ''}`}
      />
    );
  } catch (e) {
    return <span className="font-mono text-cyan-300">{math}</span>;
  }
};
