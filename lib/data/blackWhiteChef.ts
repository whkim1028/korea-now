import { supabase } from '@/lib/supabase';
import type {
  BlackWhiteChefEpisode,
  BlackWhiteChefCard,
  REGION_NAME_TO_CODE,
  REGION_NAME_TO_DISPLAY
} from '@/types/blackWhiteChef';

// Import the mapping constants
const REGION_CODE_MAP: Record<string, string> = {
  '강원': 'GANGWON',
  '경기': 'GYEONGGI',
  '경남': 'GYEONGNAM',
  '경북': 'GYEONGBUK',
  '광주': 'GWANGJU',
  '대구': 'DAEGU',
  '대전': 'DAEJEON',
  '부산': 'BUSAN',
  '서울': 'SEOUL',
  '세종': 'SEJONG',
  '울산': 'ULSAN',
  '인천': 'INCHEON',
  '전남': 'JEONNAM',
  '전북': 'JEONBUK',
  '제주도': 'JEJU',
  '제주': 'JEJU',
  '충남': 'CHUNGNAM',
  '충북': 'CHUNGBUK',
};

const REGION_DISPLAY_MAP: Record<string, string> = {
  '강원': 'Gangwon',
  '경기': 'Gyeonggi',
  '경남': 'Gyeongnam',
  '경북': 'Gyeongbuk',
  '광주': 'Gwangju',
  '대구': 'Daegu',
  '대전': 'Daejeon',
  '부산': 'Busan',
  '서울': 'Seoul',
  '세종': 'Sejong',
  '울산': 'Ulsan',
  '인천': 'Incheon',
  '전남': 'Jeonnam',
  '전북': 'Jeonbuk',
  '제주도': 'Jeju',
  '제주': 'Jeju',
  '충남': 'Chungnam',
  '충북': 'Chungbuk',
};

/**
 * Extract ingredient name from episode description
 * 예: "Jindo green onion match..." → "Green Onion"
 */
function extractIngredient(description: string): string {
  // Simple pattern matching for common ingredients
  const patterns = [
    /(\w+\s+\w+)\s+(match|challenge|battle)/i,
    /using\s+(\w+\s+\w+)/i,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      // Capitalize each word
      return match[1]
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
  }

  // Fallback: return first 2-3 words
  const words = description.split(' ').slice(0, 3);
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get short description (first sentence or ~100 chars)
 */
function getShortDescription(description: string): string {
  // Get first sentence
  const firstSentence = description.split('.')[0];
  if (firstSentence.length <= 120) {
    return firstSentence + '.';
  }
  // Truncate to ~100 chars
  return description.substring(0, 100) + '...';
}

/**
 * Transform DB episode to Card format
 */
function transformToCard(episode: BlackWhiteChefEpisode): BlackWhiteChefCard {
  const regionCode = REGION_CODE_MAP[episode.region_name] || episode.region_name.toUpperCase();
  const regionName = REGION_DISPLAY_MAP[episode.region_name] || episode.region_name;
  const ingredient = extractIngredient(episode.episode_desc);
  const description = getShortDescription(episode.episode_desc);

  return {
    id: episode.id,
    episode: episode.episode,
    regionCode,
    regionName,
    regionDetailName: episode.region_detail_name_eng || episode.region_detail_name,
    ingredient,
    description,
    chefs: episode.related_chef,
    thumbnail: `/black_white_chef/${episode.region_detail_name_eng}/1`,
  };
}

/**
 * Get all active Culinary Class Wars episodes
 */
export async function getBlackWhiteChefEpisodes(): Promise<BlackWhiteChefCard[]> {
  try {
    const { data, error } = await supabase
      .from('black_white_chef')
      .select('*')
      .eq('is_active', true)
      .order('episode', { ascending: false })
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching Culinary Class Wars episodes:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform to card format
    const cards = data.map(transformToCard);

    // Group by (region_detail_name_eng, episode) to remove duplicates
    // Keep one entry per region per episode
    const uniqueEpisodes = new Map<string, BlackWhiteChefCard>();
    cards.forEach(card => {
      const key = `${card.regionDetailName}-${card.episode}`;
      // Keep the first occurrence (or use !uniqueEpisodes.has(key) to always keep first)
      if (!uniqueEpisodes.has(key)) {
        uniqueEpisodes.set(key, card);
      }
    });

    return Array.from(uniqueEpisodes.values());
  } catch (error) {
    console.error('Error in getBlackWhiteChefEpisodes:', error);
    return [];
  }
}

/**
 * Get featured episodes for home page (limit)
 */
export async function getFeaturedBlackWhiteChefEpisodes(limit: number = 8): Promise<BlackWhiteChefCard[]> {
  const allEpisodes = await getBlackWhiteChefEpisodes();
  return allEpisodes.slice(0, limit);
}

/**
 * Get a single episode by ID
 */
export async function getBlackWhiteChefEpisodeById(id: string): Promise<BlackWhiteChefEpisode | null> {
  try {
    const { data, error } = await supabase
      .from('black_white_chef')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching Culinary Class Wars episode:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getBlackWhiteChefEpisodeById:', error);
    return null;
  }
}
