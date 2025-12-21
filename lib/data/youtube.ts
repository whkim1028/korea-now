import { YouTubeVideo } from "@/types/youtube";

const YOUTUBE_API_KEY = "AIzaSyDgN8qBuakwRo7Ju93U31ac65lcny5VYJE";
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos";

// Keywords to filter Korean food content
const FOOD_KEYWORDS = ["먹방", "맛집", "점심", "포장마차", "식당"];
const CATEGORY_ID = ["26", "21", "22", "19"];

/**
 * Check if video title or description contains any food-related keywords
 */
function containsFoodKeywords(title: string, description: string): boolean {
  const searchText = `${title} ${description}`.toLowerCase();
  return FOOD_KEYWORDS.some((keyword) =>
    searchText.includes(keyword.toLowerCase())
  );
}

/**
 * Fetch videos from YouTube API
 */
async function fetchYouTubeVideos(
  maxResults: number,
  pageToken?: string
): Promise<{ videos: YouTubeVideo[]; nextPageToken?: string }> {
  const params = new URLSearchParams({
    part: "snippet,statistics",
    chart: "mostPopular",
    regionCode: "KR",
    videoCategoryId: "26", // Howto & Style
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY,
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const response = await fetch(`${YOUTUBE_API_URL}?${params.toString()}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  const data = await response.json();

  const videos: YouTubeVideo[] = data.items
    .filter((item: any) => {
      // Filter by food-related keywords
      const title = item.snippet?.title || "";
      const description = item.snippet?.description || "";
      return containsFoodKeywords(title, description);
    })
    .map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: parseInt(item.statistics?.viewCount || "0"),
      likeCount: item.statistics?.likeCount
        ? parseInt(item.statistics.likeCount)
        : undefined,
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    }));

  return {
    videos,
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Get top trending Korean food videos
 * Fetches up to 100 videos and filters by food-related keywords
 */
export async function getYouTubeVideos(
  limit?: number
): Promise<YouTubeVideo[]> {
  try {
    const allVideos: YouTubeVideo[] = [];
    let pageToken: string | undefined = undefined;
    const targetCount = limit || 100;

    // YouTube API allows max 50 results per request
    // We'll fetch in batches until we have enough filtered videos
    while (allVideos.length < targetCount) {
      const batchSize = Math.min(50, targetCount - allVideos.length + 20); // Fetch extra to account for filtering
      const { videos, nextPageToken } = await fetchYouTubeVideos(
        batchSize,
        pageToken
      );

      allVideos.push(...videos);

      // If no more pages or we have enough videos, stop
      if (!nextPageToken || allVideos.length >= targetCount) {
        break;
      }

      pageToken = nextPageToken;
    }

    // Return limited results
    return allVideos.slice(0, targetCount);
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}

/**
 * Get featured videos for the home page
 */
export async function getFeaturedYouTubeVideos(
  count: number = 5
): Promise<YouTubeVideo[]> {
  return getYouTubeVideos(count);
}
