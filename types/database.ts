// Glossary type - used in multiple tables as jsonb
export type Glossary = Record<string, string>;

// Editorial (List / Metadata) - food_editorial_posts_translations
export interface EditorialTranslation {
  id?: string; // UUID type
  site: string;
  url: string;
  lang: string;
  title_translated: string;
  summary_translated?: string;
  summary_short?: string;
  summary_bullets?: string[];
  glossary?: Glossary;
  image_url?: string;
  original_image_url?: string; // From food_editorial_posts table
  created_at?: string;
  updated_at?: string;
  translated_at?: string;
  model?: string;
  prompt_version?: string;
}

// Editorial Content (Full Body) - food_editorial_post_content_translations
export interface EditorialContentTranslation {
  id?: string; // UUID type
  site: string;
  url: string;
  lang: string;
  content_translated: string;
  content_summary?: string;
  content_bullets?: string[];
  glossary?: Glossary;
  images?: string[]; // Images from food_editorial_post_content
  created_at?: string;
  updated_at?: string;
  translated_at?: string;
  model?: string;
  prompt_version?: string;
}

// Restaurant List - popular_restaurants_localizations
export interface RestaurantTranslation {
  id?: number;
  restaurant_id?: string;
  site?: string;
  url?: string;
  lang: string;
  name: string;
  summary_short?: string;
  summary_bullets?: string[];
  region_name?: string;
  short_description?: string;
  address?: string; // Address is available in popular_restaurants_localizations
  menu?: string; // Menu is available in popular_restaurants_localizations
  glossary?: Glossary;
  image_url?: string;
  original_image_url?: string; // From popular_restaurants table
  original_url?: string; // From popular_restaurants table
  category_translated?: string; // From popular_restaurants_detail_translations table
  status?: string;
  created_at?: string;
  updated_at?: string;
  translated_at?: string;
  generated_at?: string;
  model?: string;
  prompt_version?: string;
  tokens_in?: number;
  tokens_out?: number;
  cost_usd?: number;
  error?: string | null;
}

// Restaurant Detail Raw Data - popular_restaurants_detail
export interface RestaurantDetail {
  id?: number;
  site: string;
  url: string;
  name: string;
  category?: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  operating_hours?: string;
  facilities?: string;
  rating?: number;
  rating_count?: number;
  image_urls?: string[];
  menus?: any; // JSON field
  created_at?: string;
  updated_at?: string;
}

// Restaurant Detail Translation - popular_restaurant_detail_localizations
export interface RestaurantDetailTranslation {
  id?: number;
  site: string;
  url: string;
  lang: string;
  name_translated?: string;
  category_translated?: string;
  description_translated?: string;
  address_translated?: string;
  operating_hours_translated?: string;
  menus_translated?: string;
  facilities_translated?: string;
  content_translated?: string;
  menu_translated?: string;
  tips_translated?: string;
  summary_short?: string;
  summary_bullets?: string[];
  glossary?: Glossary;
  geo_w?: number; // latitude (위도)
  geo_g?: number; // longitude (경도)
  created_at?: string;
  updated_at?: string;
  translated_at?: string;
  model?: string;
  prompt_version?: string;
}

// Combined Restaurant data (header + detail + raw detail)
export interface RestaurantFull extends RestaurantTranslation {
  detail?: RestaurantDetailTranslation;
  detailRaw?: RestaurantDetail;
}

// Combined Editorial data (header + content)
export interface EditorialFull extends EditorialTranslation {
  content?: EditorialContentTranslation;
  restaurants?: RestaurantTranslation[];
}

// Glossary Entry for aggregated glossary page
export interface GlossaryEntry {
  term: string;
  definition: string;
  source_type: 'editorial' | 'editorial_content' | 'restaurant' | 'restaurant_detail';
  source_url: string;
}
