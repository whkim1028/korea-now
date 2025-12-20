import { supabase } from '@/lib/supabase';
import type { RestaurantTranslation, RestaurantDetailTranslation, RestaurantDetail, RestaurantFull } from '@/types/database';

/**
 * Get all restaurants (for list page)
 * Joins with popular_restaurants to get original images
 * Fetches category_translated from popular_restaurants_detail_translations
 * Supports region filtering with Seoul grouping (Gangnam + Gangbuk)
 */
export async function getRestaurants(limit?: number, region?: string): Promise<RestaurantTranslation[]> {
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

  // Get URLs for fetching category_translated
  const urls = data
    .map(item => item.popular_restaurants?.url)
    .filter(Boolean) as string[];

  // Fetch category_translated from popular_restaurants_detail_translations
  let categoryMap = new Map<string, string>();
  if (urls.length > 0) {
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
    detail,
    detailRaw,
  };
}

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
    detail,
    detailRaw,
  };
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

  // Convert region codes to uppercase
  const regionCodes = data.map((item: any) => item.region_code.toUpperCase());

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
