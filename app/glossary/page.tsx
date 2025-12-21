import { getAllGlossaryEntries } from '@/lib/data/glossary';
import type { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Glossary - KoreaNow',
  description: 'Korean cultural terms and concepts explained. Your guide to understanding Korean culture.',
};

export default async function GlossaryPage() {
  const entries = await getAllGlossaryEntries();

  // Group entries by first letter
  const groupedEntries = entries.reduce((acc, entry) => {
    const firstLetter = entry.term.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const letters = Object.keys(groupedEntries).sort();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 pb-12 border-b border-gray-200">
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
            Glossary
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Korean cultural terms and concepts explained. Your guide to understanding the context behind our content.
          </p>
        </div>

        {/* No entries state */}
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No glossary entries yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Letter navigation */}
            <div className="mb-8 pb-8 border-b border-gray-200 sticky top-16 bg-white z-10">
              <div className="flex flex-wrap gap-2">
                {letters.map((letter) => (
                  <a
                    key={letter}
                    href={`#${letter}`}
                    className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </div>

            {/* Entries by letter */}
            <div className="space-y-12">
              {letters.map((letter) => (
                <section key={letter} id={letter} className="scroll-mt-32">
                  <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-900">
                    {letter}
                  </h2>
                  <dl className="space-y-6">
                    {groupedEntries[letter].map((entry) => (
                      <div key={entry.term} className="group">
                        <dt className="text-xl font-semibold text-gray-900 mb-2">
                          {entry.term}
                        </dt>
                        <dd className="text-gray-700 leading-relaxed pl-4 border-l-4 border-gray-200 group-hover:border-gray-400 transition-colors">
                          {entry.definition}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </>
        )}

        {/* Back to top */}
        {entries.length > 10 && (
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              ↑ Back to Top
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
