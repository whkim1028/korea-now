import { supabase } from '@/lib/supabase';
import type { RestaurantTranslation, RestaurantDetailTranslation, RestaurantDetail, RestaurantFull } from '@/types/database';

/**
 * Get all restaurants (for list page)
 * Joins with popular_restaurants to get original images
 */
export async function getRestaurants(limit?: number, region?: string): Promise<RestaurantTranslation[]> {
  let query = supabase
    .from('popular_restaurants_localizations')
    .select('*')
    .eq('lang', 'en')
    .order('created_at', { ascending: false });

  if (region) {
    query = query.eq('region_name', region);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data: localizations, error } = await query;

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }

  if (!localizations || localizations.length === 0) {
    return [];
  }

  // Get original images and URLs from popular_restaurants
  const restaurantIds = localizations.map(r => r.restaurant_id).filter(Boolean);
  const { data: originals } = await supabase
    .from('popular_restaurants')
    .select('id, image_url, url')
    .in('id', restaurantIds);

  // Create maps of restaurant_id -> image_url and url
  const imageMap = new Map<string, string>();
  const urlMap = new Map<string, string>();
  if (originals) {
    originals.forEach(orig => {
      if (orig.image_url) {
        imageMap.set(orig.id, orig.image_url);
      }
      if (orig.url) {
        urlMap.set(orig.id, orig.url);
      }
    });
  }

  // Merge original images and URLs into localizations
  return localizations.map(localization => ({
    ...localization,
    original_image_url: imageMap.get(localization.restaurant_id),
    original_url: urlMap.get(localization.restaurant_id),
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
 */
export async function getRegions(): Promise<string[]> {
  const { data, error } = await supabase
    .from('popular_restaurants_localizations')
    .select('region_name')
    .eq('lang', 'en')
    .not('region_name', 'is', null);

  if (error) {
    console.error('Error fetching regions:', error);
    return [];
  }

  const regions = Array.from(new Set(data.map(item => item.region_name).filter(Boolean))) as string[];
  return regions.sort();
}
