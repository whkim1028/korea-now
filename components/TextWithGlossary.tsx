'use client';

import { Fragment } from 'react';
import GlossaryTooltip from './GlossaryTooltip';
import type { Glossary } from '@/types/database';

interface TextWithGlossaryProps {
  text: string;
  glossary?: Glossary | Array<{term: string; explain: string}>;
  className?: string;
}

export default function TextWithGlossary({ text, glossary, className = '' }: TextWithGlossaryProps) {
  // Convert glossary to map
  const glossaryMap = new Map<string, string>();
  if (glossary) {
    if (Array.isArray(glossary)) {
      glossary.forEach(item => glossaryMap.set(item.term.toLowerCase(), item.explain));
    } else {
      Object.entries(glossary).forEach(([term, definition]) => {
        if (typeof definition === 'string') {
          glossaryMap.set(term.toLowerCase(), definition);
        }
      });
    }
  }

  // Function to process a single line of text for glossary terms
  const processLine = (line: string) => {
    // If no glossary, just return the text
    if (glossaryMap.size === 0) {
      return line;
    }

    // Sort terms by length (longest first) to match longer phrases before shorter ones
    const terms = Array.from(glossaryMap.keys()).sort((a, b) => b.length - a.length);

    // Create regex pattern to match any of the glossary terms (case-insensitive, whole words)
    const pattern = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

    const parts: Array<{type: 'text' | 'glossary'; content: string; definition?: string}> = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: line.slice(lastIndex, match.index),
        });
      }

      // Add glossary term
      const matchedTerm = match[0];
      const definition = glossaryMap.get(matchedTerm.toLowerCase());
      if (definition) {
        parts.push({
          type: 'glossary',
          content: matchedTerm,
          definition,
        });
      }

      lastIndex = match.index + matchedTerm.length;
    }

    // Add remaining text
    if (lastIndex < line.length) {
      parts.push({
        type: 'text',
        content: line.slice(lastIndex),
      });
    }

    return parts;
  };

  // Split text by newlines
  const lines = text.split('\n');

  return (
    <span className={className}>
      {lines.map((line, lineIndex) => {
        const processedLine = processLine(line);

        // If no glossary processing happened, just return the line
        if (typeof processedLine === 'string') {
          return (
            <Fragment key={lineIndex}>
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </Fragment>
          );
        }

        // Render line with glossary tooltips
        return (
          <Fragment key={lineIndex}>
            {processedLine.map((part, partIndex) => {
              if (part.type === 'glossary' && part.definition) {
                return (
                  <GlossaryTooltip
                    key={`${lineIndex}-glossary-${partIndex}`}
                    term={part.content}
                    definition={part.definition}
                  />
                );
              }
              return <span key={`${lineIndex}-text-${partIndex}`}>{part.content}</span>;
            })}
            {lineIndex < lines.length - 1 && <br />}
          </Fragment>
        );
      })}
    </span>
  );
}
