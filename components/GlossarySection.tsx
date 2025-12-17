import type { Glossary } from '@/types/database';

interface GlossarySectionProps {
  glossary?: Glossary | Array<{term: string; explain: string}>;
}

export default function GlossarySection({ glossary }: GlossarySectionProps) {
  if (!glossary) {
    return null;
  }

  // Handle both array format [{term, explain}] and object format {term: definition}
  let entries: Array<[string, string]> = [];

  if (Array.isArray(glossary)) {
    // Array format from database
    if (glossary.length === 0) return null;
    entries = glossary.map(item => [item.term, item.explain]);
  } else {
    // Object format
    if (Object.keys(glossary).length === 0) return null;
    entries = Object.entries(glossary);
  }

  // Sort alphabetically by term
  entries.sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="mt-12 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        Glossary
      </h2>
      <dl className="space-y-4">
        {entries.map(([term, definition]) => (
          <div key={term} className="border-l-4 border-gray-200 pl-4">
            <dt className="font-semibold text-gray-900 mb-1">
              {term}
            </dt>
            <dd className="text-gray-700 leading-relaxed">
              {definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
