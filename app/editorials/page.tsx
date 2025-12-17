import { getEditorials } from '@/lib/data/editorials';
import EditorialCard from '@/components/EditorialCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial - KoreaNow',
  description: 'Discover curated stories about Korean culture, food, and trends.',
};

export default async function EditorialsPage() {
  const editorials = await getEditorials();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Editorial
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            In-depth stories and curated guides about what&apos;s happening in Korea right now.
          </p>
        </div>

        {/* Editorial Grid */}
        {editorials.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No editorials available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {editorials.map((editorial) => (
              <EditorialCard key={editorial.id} editorial={editorial} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
