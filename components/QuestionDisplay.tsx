"use client";

import { memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type QuestionDisplayProps = {
  questionText: string;
  codeSnippet?: string;
  language?: string;
};

function QuestionDisplayComponent({ questionText, codeSnippet, language = "c" }: QuestionDisplayProps) {
  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed text-slate-200">{questionText}</p>
      {codeSnippet ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            customStyle={{
              background: "transparent",
              margin: 0,
              padding: "1.5rem",
              fontSize: "0.95rem",
              lineHeight: 1.7
            }}
            wrapLongLines
            showLineNumbers
          >
            {codeSnippet.trim()}
          </SyntaxHighlighter>
        </div>
      ) : null}
    </div>
  );
}

export const QuestionDisplay = memo(QuestionDisplayComponent);
