import { supabase } from '@/lib/supabase';
import type { GlossaryEntry } from '@/types/database';

/**
 * Aggregate glossary entries from all translation tables
 */
export async function getAllGlossaryEntries(): Promise<GlossaryEntry[]> {
  const glossaryMap = new Map<string, GlossaryEntry>();

  // Fetch from food_editorial_posts_translations
  const { data: editorials } = await supabase
    .from('food_editorial_posts_translations')
    .select('url, glossary')
    .eq('lang', 'en')
    .not('glossary', 'is', null);

  if (editorials) {
    editorials.forEach(item => {
      if (item.glossary) {
        Object.entries(item.glossary).forEach(([term, definition]) => {
          if (!glossaryMap.has(term)) {
            glossaryMap.set(term, {
              term,
              definition: typeof definition === 'string' ? definition : String(definition),
              source_type: 'editorial',
              source_url: item.url,
            });
          }
        });
      }
    });
  }

  // Fetch from food_editorial_post_content_translations
  const { data: contents } = await supabase
    .from('food_editorial_post_content_translations')
    .select('url, glossary')
    .eq('lang', 'en')
    .not('glossary', 'is', null);

  if (contents) {
    contents.forEach(item => {
      if (item.glossary) {
        Object.entries(item.glossary).forEach(([term, definition]) => {
          if (!glossaryMap.has(term)) {
            glossaryMap.set(term, {
              term,
              definition: typeof definition === 'string' ? definition : String(definition),
              source_type: 'editorial_content',
              source_url: item.url,
            });
          }
        });
      }
    });
  }

  // Fetch from popular_restaurants_localizations
  const { data: restaurants } = await supabase
    .from('popular_restaurants_localizations')
    .select('id, restaurant_id, glossary')
    .eq('lang', 'en')
    .not('glossary', 'is', null);

  if (restaurants) {
    restaurants.forEach(item => {
      if (item.glossary) {
        // Handle both array format [{term, explain}] and object format {term: definition}
        const glossaryEntries = Array.isArray(item.glossary)
          ? item.glossary.map((g: any) => [g.term, g.explain] as [string, string])
          : Object.entries(item.glossary);

        glossaryEntries.forEach(([term, definition]) => {
          if (!glossaryMap.has(term)) {
            glossaryMap.set(term, {
              term,
              definition: typeof definition === 'string' ? definition : String(definition),
              source_type: 'restaurant',
              source_url: item.restaurant_id || item.id || '',
            });
          }
        });
      }
    });
  }

  // Fetch from popular_restaurants_detail_translations
  const { data: restaurantDetails } = await supabase
    .from('popular_restaurants_detail_translations')
    .select('url, glossary')
    .eq('lang', 'en')
    .not('glossary', 'is', null);

  if (restaurantDetails) {
    restaurantDetails.forEach(item => {
      if (item.glossary) {
        // Handle both array format [{term, explain}] and object format {term: definition}
        const glossaryEntries = Array.isArray(item.glossary)
          ? item.glossary.map((g: any) => [g.term, g.explain] as [string, string])
          : Object.entries(item.glossary);

        glossaryEntries.forEach(([term, definition]) => {
          if (!glossaryMap.has(term)) {
            glossaryMap.set(term, {
              term,
              definition: typeof definition === 'string' ? definition : String(definition),
              source_type: 'restaurant_detail',
              source_url: item.url || '',
            });
          }
        });
      }
    });
  }

  // Convert to array and sort alphabetically
  const entries = Array.from(glossaryMap.values());
  entries.sort((a, b) => a.term.localeCompare(b.term));

  return entries;
}

/**
 * Get glossary entries for a specific source
 */
export function extractGlossaryFromObject(glossary?: Record<string, string>): GlossaryEntry[] {
  if (!glossary) return [];

  return Object.entries(glossary).map(([term, definition]) => ({
    term,
    definition,
    source_type: 'editorial' as const,
    source_url: '',
  }));
}
