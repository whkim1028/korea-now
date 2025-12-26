import { getBlackWhiteChefEpisodes } from '@/lib/data/blackWhiteChef';
import EpisodeCard from '@/components/EpisodeCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Culinary Class Wars Episodes - KoreaNow',
  description:
    'Explore all regional food battles from Culinary Class Wars Season 2. Discover the stories behind each episode and find authentic restaurants in those regions.',
};

export default async function EpisodesPage() {
  const episodes = await getBlackWhiteChefEpisodes();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/#black-white-chef"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
                Featured Series
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Season 2 · Episodes 2-4
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-4">
              Culinary Class Wars Episodes
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed">
              Regional food battles featuring Korea&apos;s finest ingredients and culinary traditions. Each episode showcases a different region&apos;s specialty.
            </p>
          </div>

          {/* Stats */}
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <span className="text-2xl font-bold text-gray-900">
              {episodes.length}
            </span>
            <span className="text-sm text-gray-600">episodes available</span>
          </div>
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {episodes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">
              No episodes available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Ready to Explore?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Click on any episode to learn more about the battle and discover authentic restaurants in that region.
            </p>
            <Link
              href="/#black-white-chef"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
