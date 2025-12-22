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
        className="text-gray-900 border-b-2 border-dotted border-gray-400 hover:border-gray-900 cursor-help transition-colors focus:outline-none focus:border-gray-900"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        onBlur={() => setIsOpen(false)}
        type="button"
        aria-label={`Definition of ${term}`}
      >
        {term}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile - click to close */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Tooltip */}
          <div className="absolute z-50 w-64 px-4 py-3 text-sm bg-gray-900 text-white rounded-lg shadow-xl bottom-full left-1/2 transform -translate-x-1/2 mb-2 md:mb-2">
            <p className="leading-relaxed">{definition}</p>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1 right-1 text-white/70 hover:text-white md:hidden"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </>
      )}
    </span>
  );
}
