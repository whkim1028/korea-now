import { supabase } from '@/lib/supabase';
import type { EditorialTranslation, EditorialContentTranslation, EditorialFull, RestaurantTranslation } from '@/types/database';
import { normalizeTitle } from '@/lib/utils/slug';

/**
 * Get all editorials (for list page)
 * Uses content_translations table and joins with posts_translations for metadata
 */
export async function getEditorials(limit?: number): Promise<EditorialTranslation[]> {
  let query = supabase
    .from('food_editorial_post_content_translations')
    .select('*')
    .eq('lang', 'en')
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: contentTranslations, error } = await query;

  if (error) {
    console.error('Error fetching editorials:', error);
    return [];
  }

  if (!contentTranslations || contentTranslations.length === 0) {
    return [];
  }

  // Get header metadata from posts_translations
  const urls = contentTranslations.map(t => t.url);
  const { data: headerTranslations } = await supabase
    .from('food_editorial_posts_translations')
    .select('*')
    .eq('lang', 'en')
    .in('url', urls);

  // Get original images from food_editorial_posts
  const { data: originals } = await supabase
    .from('food_editorial_posts')
    .select('url, image_url')
    .in('url', urls);

  // Create maps
  const headerMap = new Map<string, any>();
  if (headerTranslations) {
    headerTranslations.forEach(h => headerMap.set(h.url, h));
  }

  const imageMap = new Map<string, string>();
  if (originals) {
    originals.forEach(orig => {
      if (orig.image_url) {
        imageMap.set(orig.url, orig.image_url);
      }
    });
  }

  // Merge data using content_translations id
  return contentTranslations.map(content => {
    const header = headerMap.get(content.url);
    return {
      id: content.id, // Use content_translations id
      site: content.site,
      url: content.url,
      lang: content.lang,
      title_translated: header?.title_translated || '',
      summary_translated: header?.summary_translated,
      summary_short: header?.summary_short,
      summary_bullets: header?.summary_bullets,
      glossary: header?.glossary,
      image_url: header?.image_url,
      original_image_url: imageMap.get(content.url),
      created_at: content.created_at,
      updated_at: content.updated_at,
      translated_at: content.translated_at,
      model: content.model,
      prompt_version: content.prompt_version,
    };
  });
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
  const { data: translation, error } = await supabase
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

  // Get images from original content table
  const { data: original } = await supabase
    .from('food_editorial_post_content')
    .select('images')
    .eq('site', site)
    .eq('url', url)
    .single();

  return {
    ...translation,
    images: original?.images || [],
  };
}

/**
 * Get full editorial data by ID (for detail page)
 */
export async function getFullEditorialById(id: string): Promise<EditorialFull | null> {
  // Get editorial content
  const { data: editorial, error: editorialError } = await supabase
    .from('food_editorial_post_content_translations')
    .select('*')
    .eq('id', id)
    .eq('lang', 'en')
    .single();

  if (editorialError || !editorial) {
    console.error('Error fetching editorial:', editorialError);
    return null;
  }

  // Get images from original content table
  const { data: original } = await supabase
    .from('food_editorial_post_content')
    .select('images')
    .eq('site', editorial.site)
    .eq('url', editorial.url)
    .single();

  const content: EditorialContentTranslation = {
    ...editorial,
    images: original?.images || [],
  };

  // Get header metadata from posts_translations
  const { data: header } = await supabase
    .from('food_editorial_posts_translations')
    .select('*')
    .eq('site', editorial.site)
    .eq('url', editorial.url)
    .eq('lang', 'en')
    .single();

  // Get image_url from original posts table
  const { data: originalPost } = await supabase
    .from('food_editorial_posts')
    .select('image_url')
    .eq('url', editorial.url)
    .single();

  return {
    ...(header || { site: editorial.site, url: editorial.url, lang: 'en', title_translated: '' }),
    image_url: originalPost?.image_url,
    content,
    restaurants: [],
  };
}

/**
 * Get full editorial data by slug (for detail page with SEO-friendly URLs)
 * Slug format: {title-keywords}
 * Example: "best-korean-bbq-in-seoul"
 */
export async function getFullEditorialBySlug(slug: string): Promise<EditorialFull | null> {
  // Use getEditorials() which already has proper joins
  const editorials = await getEditorials();

  if (!editorials || editorials.length === 0) {
    console.error('No editorials found for slug matching');
    return null;
  }

  // Normalize the slug for comparison (convert hyphens to spaces)
  const normalizedSlug = slug.replace(/-/g, ' ');

  // Find editorial where normalized title matches the slug
  const match = editorials.find((editorial) => {
    if (!editorial.title_translated) return false;

    const normalizedDbTitle = normalizeTitle(editorial.title_translated);
    const normalizedSlugTitle = normalizeTitle(normalizedSlug);

    // Match if the beginning of the title matches the slug (for truncated slugs)
    return normalizedDbTitle.startsWith(normalizedSlugTitle) ||
           normalizedSlugTitle.startsWith(normalizedDbTitle) ||
           normalizedDbTitle === normalizedSlugTitle;
  });

  if (!match || !match.id) {
    console.error('No matching editorial found for slug:', slug);
    return null;
  }

  // Use the found editorial's ID to get full data
  return getFullEditorialById(match.id);
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
    content: content ?? undefined,
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
