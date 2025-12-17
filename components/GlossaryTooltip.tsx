'use client';

import { useState } from 'react';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
}

export default function GlossaryTooltip({ term, definition }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        className="text-gray-900 border-b-2 border-dotted border-gray-400 hover:border-gray-900 cursor-help transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {term}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-64 px-4 py-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <p className="leading-relaxed">{definition}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </div>
      )}
    </span>
  );
}
