import type { BlackWhiteChefEpisode } from '@/types/blackWhiteChef';

interface EpisodeStructuredDataProps {
  episode: BlackWhiteChefEpisode;
  regionDisplay: string;
}

export default function EpisodeStructuredData({ episode, regionDisplay }: EpisodeStructuredDataProps) {
  // Extract ingredient from description
  const ingredientMatch = episode.episode_desc.match(/(\w+\s+\w+)\s+(match|challenge|battle)/i);
  const ingredient = ingredientMatch ? ingredientMatch[1] : '';

  // Parse chef names
  const chefs = episode.related_chef
    ? episode.related_chef.split(/\s+vs\s+/i).map(name => name.trim())
    : [];

  // Build structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${episode.region_detail_name_eng} ${ingredient} Battle: ${episode.related_chef || 'Regional Food Competition'}`,
    description: episode.episode_desc,
    image: [
      `https://koreanow.app/black_white_chef/${episode.region_detail_name_eng}/1.webp`,
      `https://koreanow.app/black_white_chef/${episode.region_detail_name_eng}/2.webp`,
      `https://koreanow.app/black_white_chef/${episode.region_detail_name_eng}/3.webp`,
    ],
    datePublished: episode.created_at,
    dateModified: episode.updated_at,
    author: chefs.map(chef => ({
      '@type': 'Person',
      name: chef,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'KoreaNow',
      logo: {
        '@type': 'ImageObject',
        url: 'https://koreanow.app/logo.png',
      },
    },
    about: [
      {
        '@type': 'Place',
        name: `${regionDisplay} ${episode.region_detail_name_eng}`,
        geo: {
          '@type': 'GeoCoordinates',
          addressCountry: 'KR',
        },
      },
      {
        '@type': 'Thing',
        name: ingredient,
        description: `${regionDisplay} regional specialty ingredient`,
      },
    ],
    keywords: [
      ...chefs,
      episode.related_chef,
      episode.region_detail_name_eng,
      regionDisplay,
      ingredient,
      'Culinary Class Wars',
      'Korean cuisine',
      'Korean food battle',
    ].filter(Boolean).join(', '),
    isPartOf: {
      '@type': 'TVSeries',
      name: 'Culinary Class Wars',
      alternateName: 'Black and White Chef',
    },
    episodeNumber: episode.episode,
    partOfSeason: {
      '@type': 'TVSeason',
      seasonNumber: episode.season,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
