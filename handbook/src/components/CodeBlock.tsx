'use client';

import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-java';

interface Props {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({
  code,
  language = 'java',
  filename = 'Solution.java',
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="vscode-code-block">
      {/* VS Code Window Header */}
      <div className="vscode-header">
        <div className="vscode-tab">
          <span className="vscode-lang-dot" />
          <span className="vscode-filename">{filename}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="vscode-copy-btn"
          title="Copy code to clipboard"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="vscode-content">
        <div className="vscode-line-numbers" aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i} className="vscode-line-num">
              {i + 1}
            </span>
          ))}
        </div>

        <pre className="vscode-pre">
          <code className={`language-${language}`}>
            {code.trim()}
          </code>
        </pre>
      </div>
    </div>
  );
}
