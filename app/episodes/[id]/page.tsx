import { notFound } from 'next/navigation';
import { getBlackWhiteChefEpisodeById, getEpisodeRestaurantNote } from '@/lib/data/blackWhiteChef';
import { REGION_NAME_TO_CODE, REGION_NAME_TO_DISPLAY } from '@/types/blackWhiteChef';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import EpisodeStructuredData from '@/components/EpisodeStructuredData';
import type { Metadata } from 'next';

export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every 1 hour

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

  // Extract ingredient from description (e.g., "Jindo green onion" -> "green onion")
  const ingredientMatch = episode.episode_desc.match(/(\w+\s+\w+)\s+(match|challenge|battle)/i);
  const ingredient = ingredientMatch ? ingredientMatch[1] : '';

  // Build enhanced title with chef names
  const titleWithChefs = episode.related_chef
    ? `${episode.region_detail_name_eng} ${ingredient} Battle: ${episode.related_chef}`
    : `${episode.region_detail_name_eng} ${ingredient} Battle`;

  // Enhanced description
  const description = `Watch ${episode.related_chef || 'top chefs'} compete in a ${regionDisplay} regional food battle featuring ${episode.region_detail_name_eng}'s ${ingredient}. Discover authentic Korean restaurants and local specialties from Culinary Class Wars.`;

  // Parse individual chef names for better SEO
  const chefNames = episode.related_chef
    ? episode.related_chef.split(/\s+vs\s+/i).map(name => name.trim())
    : [];

  // Keywords for SEO
  const keywords = [
    ...chefNames,  // Individual chef names
    episode.related_chef || '',  // Full chef string (e.g., "Chef A vs Chef B")
    episode.region_detail_name_eng,
    regionDisplay,
    ingredient,
    'Culinary Class Wars',
    '흑백요리사',
    'Korean food',
    'Korean restaurants',
    'Korean cuisine',
  ].filter(Boolean).join(', ');

  // Image URL for social sharing (try webp first, fallback handled by client)
  const imageUrl = `/black_white_chef/${episode.region_detail_name_eng}/1.webp`;
  const siteUrl = 'https://koreanow.app';

  return {
    title: `${titleWithChefs} - KoreaNow`,
    description,
    keywords,
    alternates: {
      canonical: `https://koreanow.app/episodes/${id}`,
    },
    openGraph: {
      title: titleWithChefs,
      description,
      type: 'article',
      images: [
        {
          url: `${siteUrl}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: `${episode.region_detail_name_eng} ${ingredient} battle scene`,
        },
      ],
      locale: 'en_US',
      siteName: 'KoreaNow',
    },
    twitter: {
      card: 'summary_large_image',
      title: titleWithChefs,
      description,
      images: [`${siteUrl}${imageUrl}`],
    },
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id } = await params;
  const episode = await getBlackWhiteChefEpisodeById(id);

  if (!episode) {
    notFound();
  }

  // Get restaurant note from bw_chef_intf_popular_restaurants table
  const restaurantNote = await getEpisodeRestaurantNote(id);

  const regionCode = REGION_NAME_TO_CODE[episode.region_name] || episode.region_name.toUpperCase();
  const regionDisplay = REGION_NAME_TO_DISPLAY[episode.region_name] || episode.region_name;
  const restaurantLink = `/restaurants?region=${regionCode}&region_detail_name=${episode.region_detail_name_eng}`;

  return (
    <article className="min-h-screen bg-white">
      {/* SEO: Structured Data (JSON-LD) */}
      <EpisodeStructuredData episode={episode} regionDisplay={regionDisplay} />

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

          {/* Image Gallery */}
          <ImageGallery
            regionName={episode.region_detail_name_eng}
            imageCount={3}
            chefNames={episode.related_chef}
          />
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
              Related Chefs
            </h2>
            <p className="text-lg text-gray-700">
              {episode.related_chef}
            </p>
          </div>
        )}

        {/* Episode Notes */}
        {episode.note && (
          <div className="mb-12 pb-12 border-b border-gray-200">
            <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">
                    Episode Notes
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {episode.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Notes */}
        {restaurantNote && (
          <div className="mb-12 pb-12 border-b border-gray-200">
            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <div>
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">
                    About the Restaurants
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {restaurantNote}
                  </p>
                </div>
              </div>
            </div>
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
