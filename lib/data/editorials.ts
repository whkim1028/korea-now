import { supabase } from '@/lib/supabase';
import type { EditorialTranslation, EditorialContentTranslation, EditorialFull, RestaurantTranslation } from '@/types/database';

/**
 * Get all editorials (for list page)
 * Joins with food_editorial_posts to get original images
 */
export async function getEditorials(limit?: number): Promise<EditorialTranslation[]> {
  let query = supabase
    .from('food_editorial_posts_translations')
    .select('*')
    .eq('lang', 'en')
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: translations, error } = await query;

  if (error) {
    console.error('Error fetching editorials:', error);
    return [];
  }

  if (!translations || translations.length === 0) {
    return [];
  }

  // Get original images from food_editorial_posts
  const urls = translations.map(t => t.url);
  const { data: originals } = await supabase
    .from('food_editorial_posts')
    .select('url, image_url')
    .in('url', urls);

  // Create a map of url -> image_url
  const imageMap = new Map<string, string>();
  if (originals) {
    originals.forEach(orig => {
      if (orig.image_url) {
        imageMap.set(orig.url, orig.image_url);
      }
    });
  }

  // Merge original images into translations
  return translations.map(translation => ({
    ...translation,
    original_image_url: imageMap.get(translation.url),
  }));
}

/**
 * Get a single editorial by URL (for detail page header)
 */
export async function getEditorialByUrl(site: string, url: string): Promise<EditorialTranslation | null> {
  const { data, error } = await supabase
    .from('food_editorial_posts_translations')
    .select('*')
    .eq('site', site)
    .eq('url', url)
    .eq('lang', 'en')
    .single();

  if (error) {
    console.error('Error fetching editorial:', error);
    return null;
  }

  return data;
}

/**
 * Get editorial content by URL (for detail page body)
 */
export async function getEditorialContent(site: string, url: string): Promise<EditorialContentTranslation | null> {
  const { data, error } = await supabase
    .from('food_editorial_post_content_translations')
    .select('*')
    .eq('site', site)
    .eq('url', url)
    .eq('lang', 'en')
    .single();

  if (error) {
    console.error('Error fetching editorial content:', error);
    return null;
  }

  return data;
}

/**
 * Get full editorial data (header + content + related restaurants)
 */
export async function getFullEditorial(site: string, url: string): Promise<EditorialFull | null> {
  const [editorial, content] = await Promise.all([
    getEditorialByUrl(site, url),
    getEditorialContent(site, url),
  ]);

  if (!editorial) {
    return null;
  }

  return {
    ...editorial,
    content,
    restaurants: [], // TODO: Implement restaurant extraction from content if needed
  };
}

/**
 * Get featured editorials for home page (randomized from recent posts)
 */
export async function getFeaturedEditorials(limit: number = 6): Promise<EditorialTranslation[]> {
  // Get more candidates to shuffle (최신 20개 중에서 랜덤 선정)
  const candidates = await getEditorials(20);

  if (candidates.length === 0) {
    return [];
  }

  // Fisher-Yates shuffle algorithm for true randomization
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return only the requested number
  return shuffled.slice(0, Math.min(limit, shuffled.length));
}
