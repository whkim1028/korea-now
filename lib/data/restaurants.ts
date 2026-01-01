import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import type { RestaurantTranslation, RestaurantDetailTranslation, RestaurantDetail, RestaurantFull } from '@/types/database';
import { parseRestaurantSlug } from '@/lib/utils/slug';

/**
 * Get all restaurants (for list page)
 * Joins with popular_restaurants to get original images
 * Fetches category_translated from popular_restaurants_detail_translations
 * Supports region filtering with Seoul grouping (Gangnam + Gangbuk)
 * Supports region_detail filtering for Culinary Class Wars episodes
 * Supports region_detail_name filtering for detailed regional filtering
 */
export async function getRestaurants(limit?: number, region?: string, regionDetail?: string, regionDetailName?: string): Promise<RestaurantTranslation[]> {
  let query = supabase
    .from('popular_restaurants_localizations')
    .select(`
      *,
      popular_restaurants!inner(image_url, url)
    `)
    .eq('lang', 'en')
    .order('created_at', { ascending: false });

  // Apply region filter at DB level
  if (region) {
    const regionUpper = region.toUpperCase();

    if (regionUpper === 'SEOUL') {
      // Seoul includes both Gangnam and Gangbuk
      query = query.or('region_name.ilike.GANGNAM%,region_name.ilike.GANGBUK%');
    } else {
      // Match specific region code
      query = query.ilike('region_name', `${regionUpper}%`);
    }
  }

  // Apply region_detail filter (for Culinary Class Wars episodes - uses numeric code)
  if (regionDetail) {
    query = query.eq('region_detail', regionDetail);
  }

  // Apply region_detail_name filter (for detailed regional filtering - uses name)
  if (regionDetailName) {
    query = query.eq('region_detail_name', regionDetailName);
  }

  // Apply limit
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Fetch category_translated in a single query for better performance
  const urls = data
    .map(item => item.popular_restaurants?.url)
    .filter(Boolean) as string[];

  let categoryMap = new Map<string, string>();
  if (urls.length > 0) {
    // Fetch all categories in one query instead of N queries
    const { data: detailData } = await supabase
      .from('popular_restaurants_detail_translations')
      .select('url, category_translated')
      .in('url', urls)
      .eq('lang', 'en');

    if (detailData) {
      detailData.forEach(detail => {
        if (detail.url && detail.category_translated) {
          categoryMap.set(detail.url, detail.category_translated);
        }
      });
    }
  }

  // Map joined data to include original_image_url, original_url, and category_translated
  return data.map(item => ({
    ...item,
    original_image_url: item.popular_restaurants?.image_url,
    original_url: item.popular_restaurants?.url,
    category_translated: item.popular_restaurants?.url
      ? categoryMap.get(item.popular_restaurants.url)
      : undefined,
    popular_restaurants: undefined, // Remove nested object
  }));
}

/**
 * Get a single restaurant by ID (for detail page)
 * Joins with popular_restaurants to get original image
 */
export async function getRestaurantById(id: string): Promise<RestaurantTranslation | null> {
  const { data: localization, error } = await supabase
    .from('popular_restaurants_localizations')
    .select('*')
    .eq('id', id)
    .eq('lang', 'en')
    .maybeSingle();

  if (error) {
    console.error('Error fetching restaurant by ID:', error);
    return null;
  }

  if (!localization) {
    return null;
  }

  // Get original image and URL from popular_restaurants
  if (localization.restaurant_id) {
    const { data: original } = await supabase
      .from('popular_restaurants')
      .select('image_url, url')
      .eq('id', localization.restaurant_id)
      .maybeSingle();

    if (original) {
      return {
        ...localization,
        original_image_url: original.image_url,
        original_url: original.url,
      };
    }
  }

  return localization;
}

/**
 * Get a single restaurant by slug (for detail page with SEO-friendly URLs)
 * Slug format: {region}-{restaurant-name}
 * Example: "gangnam-mingles"
 */
export async function getRestaurantBySlug(slug: string): Promise<RestaurantTranslation | null> {
  const { region, name } = parseRestaurantSlug(slug);

  // Query restaurants that match the region and name pattern
  const { data: restaurants, error } = await supabase
    .from('popular_restaurants_localizations')
    .select(`
      *,
      popular_restaurants!inner(image_url, url)
    `)
    .eq('lang', 'en')
    .ilike('region_name', `${region.toUpperCase()}%`);

  if (error) {
    console.error('Error fetching restaurant by slug:', error);
    return null;
  }

  if (!restaurants || restaurants.length === 0) {
    return null;
  }

  // Find the best match by comparing normalized names
  const normalizedSearchName = name.toLowerCase().replace(/[^a-z]/g, '');

  const match = restaurants.find((restaurant) => {
    // Normalize restaurant name: remove parentheses, Korean chars, special chars
    const normalizedDbName = restaurant.name
      .replace(/\([^)]*\)/g, '')
      .replace(/[가-힣]/g, '')
      .toLowerCase()
      .replace(/[^a-z]/g, '');

    return normalizedDbName === normalizedSearchName;
  });

  if (!match) {
    return null;
  }

  // Add original image and URL
  return {
    ...match,
    original_image_url: match.popular_restaurants?.image_url,
    original_url: match.popular_restaurants?.url,
    popular_restaurants: undefined,
  };
}

/**
 * Get a single restaurant by URL (for detail page header) - DEPRECATED
 * Use getRestaurantById instead
 * NOTE: 'site' column may not exist in all schemas
 */
export async function getRestaurantByUrl(site: string, url: string): Promise<RestaurantTranslation | null> {
  // First try without site filter (in case column doesn't exist)
  let { data: localization, error } = await supabase
    .from('popular_restaurants_localizations')
    .select('*')
    .eq('url', url)
    .eq('lang', 'en')
    .maybeSingle();

  if (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }

  if (!localization) {
    return null;
  }

  // Get original image and URL from popular_restaurants
  if (localization.restaurant_id) {
    const { data: original } = await supabase
      .from('popular_restaurants')
      .select('image_url, url')
      .eq('id', localization.restaurant_id)
      .maybeSingle();

    if (original) {
      return {
        ...localization,
        original_image_url: original.image_url,
        original_url: original.url,
      };
    }
  }

  return localization;
}

/**
 * Get raw restaurant detail by URL (for ratings, images, facilities, etc.)
 * NOTE: This table may not exist yet in all schemas
 */
export async function getRestaurantDetailRaw(site: string, url: string): Promise<RestaurantDetail | null> {
  try {
    const { data, error } = await supabase
      .from('popular_restaurants_detail')
      .select('*')
      .eq('url', url)
      .maybeSingle();

    if (error) {
      // Table might not exist yet - that's okay
      return null;
    }

    return data;
  } catch (e) {
    // Silently handle missing table
    return null;
  }
}

/**
 * Get restaurant detail translation by URL (for detail page body)
 * NOTE: This table may not exist yet in all schemas
 */
export async function getRestaurantDetail(url: string): Promise<RestaurantDetailTranslation | null> {
  try {
    const { data, error } = await supabase
      .from('popular_restaurants_detail_translations')
      .select('*')
      .eq('url', url)
      .eq('lang', 'en')
      .maybeSingle();

    if (error) {
      return null;
    }

    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Get full restaurant data by ID (header + detail + raw detail)
 */
export async function getFullRestaurantById(id: string): Promise<RestaurantFull | null> {
  const restaurant = await getRestaurantById(id);

  if (!restaurant) {
    return null;
  }

  // Get detail and raw detail if url exists
  let detail = null;
  let detailRaw = null;

  const url = restaurant.original_url || restaurant.url;

  if (url) {
    const site = url.includes('siksin.co.kr') ? 'siksin' : 'unknown';

    [detail, detailRaw] = await Promise.all([
      getRestaurantDetail(url),
      getRestaurantDetailRaw(site, url),
    ]);
  }

  return {
    ...restaurant,
    detail: detail ?? undefined,
    detailRaw: detailRaw ?? undefined,
  };
}

/**
 * Get full restaurant data by slug (header + detail + raw detail)
 * Slug format: {region}-{restaurant-name}
 * Example: "gangnam-mingles"
 * Cached to prevent duplicate fetches in generateMetadata and page render
 */
export const getFullRestaurantBySlug = cache(async (slug: string): Promise<RestaurantFull | null> => {
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return null;
  }

  // Get detail and raw detail if url exists
  let detail = null;
  let detailRaw = null;

  const url = restaurant.original_url || restaurant.url;

  if (url) {
    const site = url.includes('siksin.co.kr') ? 'siksin' : 'unknown';

    [detail, detailRaw] = await Promise.all([
      getRestaurantDetail(url),
      getRestaurantDetailRaw(site, url),
    ]);
  }

  return {
    ...restaurant,
    detail: detail ?? undefined,
    detailRaw: detailRaw ?? undefined,
  };
});

/**
 * Get full restaurant data (header + detail + raw detail) - DEPRECATED
 * Use getFullRestaurantById instead
 */
export async function getFullRestaurant(site: string, url: string): Promise<RestaurantFull | null> {
  const restaurant = await getRestaurantByUrl(site, url);

  if (!restaurant) {
    return null;
  }

  const [detail, detailRaw] = await Promise.all([
    getRestaurantDetail(url),
    getRestaurantDetailRaw(site, url),
  ]);

  return {
    ...restaurant,
    detail: detail ?? undefined,
    detailRaw: detailRaw ?? undefined,
  };
}

/**
 * Get unique region_detail_name values for a specific region
 * Returns sorted list of detail region names (e.g., "Jindo", "Wando", "Yeosu" for Jeonnam)
 */
export async function getRegionDetails(region: string): Promise<string[]> {
  if (!region) return [];

  const regionUpper = region.toUpperCase();

  // Build query based on region
  let query = supabase
    .from('popular_restaurants_localizations')
    .select('region_detail_name')
    .eq('lang', 'en')
    .not('region_detail_name', 'is', null);

  if (regionUpper === 'SEOUL') {
    // Seoul includes both Gangnam and Gangbuk
    query = query.or('region_name.ilike.GANGNAM%,region_name.ilike.GANGBUK%');
  } else {
    // Match specific region code
    query = query.ilike('region_name', `${regionUpper}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching region details:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get unique region_detail_name values and sort
  const uniqueDetails = Array.from(
    new Set(data.map((item: any) => item.region_detail_name).filter(Boolean))
  ).sort();

  return uniqueDetails;
}

/**
 * Get unique regions for filtering
 * Uses RPC function with GROUP BY to get unique region codes
 * Includes special handling for Seoul (combines Gangnam + Gangbuk)
 */
export async function getRegions(): Promise<string[]> {
  // Call RPC function that executes:
  // SELECT substring(region_name FROM '^[^ ]+')
  // FROM koreanow.popular_restaurants_localizations
  // WHERE lang = 'en'
  // GROUP BY substring(region_name FROM '^[^ ]+');
  const { data, error } = await supabase.rpc('get_unique_region_codes');

  if (error) {
    console.error('Error fetching regions:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Convert region codes to uppercase, filtering out null values
  const regionCodes = data
    .filter((item: any) => item.region_code !== null && item.region_code !== undefined)
    .map((item: any) => item.region_code.toUpperCase());

  console.log('Region codes from DB:', regionCodes);

  // Check if we have Gangnam or Gangbuk
  const hasGangnam = regionCodes.includes('GANGNAM');
  const hasGangbuk = regionCodes.includes('GANGBUK');

  // Build final region list
  const result: string[] = [];

  // Add Seoul first if we have Gangnam or Gangbuk
  if (hasGangnam || hasGangbuk) {
    result.push('SEOUL');
    if (hasGangnam) result.push('GANGNAM');
    if (hasGangbuk) result.push('GANGBUK');
  }

  // Add all other regions (excluding Gangnam and Gangbuk)
  const otherRegions = regionCodes
    .filter((r: string) => r !== 'GANGNAM' && r !== 'GANGBUK')
    .sort();

  result.push(...otherRegions);

  return result;
}
