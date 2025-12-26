import { notFound } from 'next/navigation';
import { getBlackWhiteChefEpisodeById } from '@/lib/data/blackWhiteChef';
import { REGION_NAME_TO_CODE, REGION_NAME_TO_DISPLAY } from '@/types/blackWhiteChef';
import Link from 'next/link';
import type { Metadata } from 'next';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface EpisodePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { id } = await params;
  const episode = await getBlackWhiteChefEpisodeById(id);

  if (!episode) {
    return {
      title: 'Episode Not Found - KoreaNow',
    };
  }

  const regionDisplay = REGION_NAME_TO_DISPLAY[episode.region_name] || episode.region_name;

  return {
    title: `${episode.region_detail_name_eng} · Episode ${episode.episode} - KoreaNow`,
    description: episode.episode_desc.substring(0, 150) + '...',
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id } = await params;
  const episode = await getBlackWhiteChefEpisodeById(id);

  if (!episode) {
    notFound();
  }

  const regionCode = REGION_NAME_TO_CODE[episode.region_name] || episode.region_name.toUpperCase();
  const regionDisplay = REGION_NAME_TO_DISPLAY[episode.region_name] || episode.region_name;
  const restaurantLink = `/restaurants?region=${regionCode}&region_detail_name=${episode.region_detail_name_eng}`;

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section with Image Placeholder */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          {/* Episode Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-semibold rounded-full">
              Episode {episode.episode}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {episode.region_detail_name_eng}
          </h1>

          {/* Region Info */}
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-900 text-base font-semibold rounded-full">
              {regionDisplay}
            </span>
            <span className="text-gray-600 text-lg">
              Regional Food Battle
            </span>
          </div>

          {/* Image Gallery Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-white/50 backdrop-blur-sm rounded-lg border-2 border-gray-300 flex items-center justify-center"
              >
                <div className="text-center text-gray-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-xs font-medium">Battle Image {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Battle Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            The Battle
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {episode.episode_desc}
          </p>
        </div>

        {/* Chefs */}
        {episode.related_chef && (
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Competing Chefs
            </h2>
            <p className="text-lg text-gray-700">
              {episode.related_chef}
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 border-2 border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Explore Local Restaurants
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover authentic restaurants in {regionDisplay} {episode.region_detail_name_eng} that serve the regional specialties featured in this episode.
            </p>
            <Link
              href={restaurantLink}
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>View Restaurants in {episode.region_detail_name_eng}</span>
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Back to Episodes */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link
            href="/#black-white-chef"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            ← Back to All Episodes
          </Link>
        </div>
      </div>
    </article>
  );
}
