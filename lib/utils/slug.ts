/**
 * Generate SEO-friendly slug for restaurant URLs
 * Format: {region}-{restaurant-name}
 * Example: "gangnam-mingles"
 */
export function generateRestaurantSlug(name: string, regionName?: string): string {
  // Step 1: Remove parentheses and their contents (e.g., "(명글스)" or "(Mingles)")
  // Step 2: Remove all Korean characters
  let slug = name
    .replace(/\([^)]*\)/g, '')     // Remove (content)
    .replace(/[가-힣]/g, '')        // Remove Korean characters
    .trim();

  // Step 3: Normalize to URL-safe format
  slug = slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')      // Remove special characters except word chars, spaces, hyphens
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens

  // Step 4: Add region prefix (extract first word before space, convert to lowercase)
  if (regionName) {
    const region = regionName
      .split(' ')[0]               // Extract first part (e.g., "GANGNAM 123" → "GANGNAM")
      .toLowerCase()
      .replace(/[^a-z]/g, '');     // Keep only letters

    slug = `${region}-${slug}`;
  }

  return slug;
}

/**
 * Parse slug back to region and name for DB lookup
 * Example: "gangnam-mingles" → { region: "gangnam", name: "mingles" }
 */
export function parseRestaurantSlug(slug: string): { region: string; name: string } {
  const parts = slug.split('-');

  // First part is region, rest is restaurant name
  const region = parts[0];
  const name = parts.slice(1).join('-');

  return { region, name };
}

/**
 * Generate SEO-friendly slug for editorial URLs
 * Format: {title-keywords} (max 10 words)
 * Example: "best-korean-bbq-in-seoul"
 */
export function generateEditorialSlug(title: string): string {
  // Step 1: Normalize title to lowercase and remove special characters
  let slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')      // Remove special characters except word chars, spaces, hyphens
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens

  // Step 2: Limit to first 10 words for reasonable URL length
  const words = slug.split('-').filter(word => word.length > 0);
  if (words.length > 10) {
    slug = words.slice(0, 10).join('-');
  }

  return slug;
}

/**
 * Normalize title for comparison (used in DB lookups)
 * Removes special characters and extra spaces for matching
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')       // Remove special characters
    .replace(/\s+/g, ' ')          // Normalize spaces
    .trim();
}
