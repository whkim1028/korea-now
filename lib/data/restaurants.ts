import { supabase } from '@/lib/supabase';
import type { RestaurantTranslation, RestaurantDetailTranslation, RestaurantDetail, RestaurantFull } from '@/types/database';

/**
 * Get all restaurants (for list page)
 * Joins with popular_restaurants to get original images
 * Supports region filtering with Seoul grouping (Gangnam + Gangbuk)
 */
export async function getRestaurants(limit?: number, region?: string): Promise<RestaurantTranslation[]> {
  let query = supabase
    .from('popular_restaurants_localizations')
    .select('*')
    .eq('lang', 'en')
    .order('created_at', { ascending: false });

  // When filtering by region, we need to fetch all records first
  // Otherwise, set limit to optimize query
  if (!region && limit) {
    query = query.limit(limit);
  } else if (region) {
    // Fetch all records when filtering by region
    query = query.limit(10000);
  }

  const { data: localizations, error } = await query;

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }

  if (!localizations || localizations.length === 0) {
    return [];
  }

  console.log('=== getRestaurants DEBUG ===');
  console.log('Selected region:', region);
  console.log('Total fetched:', localizations.length);

  // Filter by region code (extracted from region_name)
  let filtered = localizations;
  if (region) {
    const regionUpper = region.toUpperCase();

    console.log('Filtering for region:', regionUpper);

    if (regionUpper === 'SEOUL') {
      // Seoul includes both Gangnam and Gangbuk
      filtered = localizations.filter(item => {
        if (!item.region_name) return false;
        const code = item.region_name.split(' ')[0].toUpperCase();
        return code === 'GANGNAM' || code === 'GANGBUK';
      });
    } else {
      // Match specific region code
      filtered = localizations.filter(item => {
        if (!item.region_name) return false;
        const code = item.region_name.split(' ')[0].toUpperCase();
        return code === regionUpper;
      });
    }

    console.log('After filtering:', filtered.length);
    if (filtered.length > 0) {
      console.log('Sample filtered regions:', filtered.slice(0, 3).map(f => f.region_name));
    }
  }

  // Apply limit after filtering
  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  console.log('Final count after limit:', filtered.length);
  console.log('===========================');

  if (filtered.length === 0) {
    return [];
  }

  // Get original images and URLs from popular_restaurants
  const restaurantIds = filtered.map(r => r.restaurant_id).filter(Boolean);
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
  return filtered.map(localization => ({
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
