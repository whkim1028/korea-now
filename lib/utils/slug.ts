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
