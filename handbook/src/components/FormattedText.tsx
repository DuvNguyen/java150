'use client';

import React from 'react';
import katex from 'katex';

interface Props {
  text: string;
}

export default function FormattedText({ text }: Props) {
  if (!text) return null;

  // Match: $math$ or `code`
  const regex = /(\$[^$]+\$|`[^`]+`)/g;
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        if (!part) return null;

        // KaTeX Math: $...$
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const rawMath = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(rawMath, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="math-inline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return (
              <span key={index} className="math-fallback">
                {rawMath}
              </span>
            );
          }
        }

        // Inline Code: `...`
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          const code = part.slice(1, -1);
          return <code key={index}>{code}</code>;
        }

        // Plain Text
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
