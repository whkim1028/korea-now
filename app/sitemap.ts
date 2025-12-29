import { MetadataRoute } from 'next';
import { getEditorials } from '@/lib/data/editorials';
import { getRestaurants } from '@/lib/data/restaurants';
import { getBlackWhiteChefEpisodes } from '@/lib/data/blackWhiteChef';
import { generateRestaurantSlug } from '@/lib/utils/slug';

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://koreanow.app';

  // Use fewer items in development for faster page loads
  const isDev = process.env.NODE_ENV === 'development';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/editorials`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/restaurants`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/episodes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Dynamic editorial pages
    const editorials = await getEditorials(isDev ? 10 : undefined);
    const editorialPages: MetadataRoute.Sitemap = editorials.map((editorial) => ({
      url: `${baseUrl}/editorials/${editorial.id}`,
      lastModified: editorial.created_at ? new Date(editorial.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Dynamic restaurant pages
    const restaurants = await getRestaurants(isDev ? 10 : undefined);
    const restaurantPages: MetadataRoute.Sitemap = restaurants.map((restaurant) => {
      const slug = generateRestaurantSlug(restaurant.name, restaurant.region_name || undefined);
      return {
        url: `${baseUrl}/restaurants/${slug}`,
        lastModified: restaurant.created_at ? new Date(restaurant.created_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

    // Dynamic episode pages (Culinary Class Wars)
    const episodes = await getBlackWhiteChefEpisodes();
    const episodePages: MetadataRoute.Sitemap = episodes.map((episode) => ({
      url: `${baseUrl}/episodes/${episode.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

    return [...staticPages, ...editorialPages, ...restaurantPages, ...episodePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if data fetching fails
    return staticPages;
  }
}
