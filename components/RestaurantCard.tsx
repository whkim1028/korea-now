import Link from 'next/link';
import Image from 'next/image';
import type { RestaurantTranslation } from '@/types/database';
import { generateRestaurantSlug } from '@/lib/utils/slug';

interface RestaurantCardProps {
  restaurant: RestaurantTranslation;
  priority?: boolean;
  currentRegion?: string;
  currentRegionDetail?: string;
  currentRegionDetailName?: string;
}

export default function RestaurantCard({
  restaurant,
  priority = false,
  currentRegion,
  currentRegionDetail,
  currentRegionDetailName,
}: RestaurantCardProps) {
  // Generate SEO-friendly slug: {region}-{restaurant-name}
  const slug = generateRestaurantSlug(restaurant.name, restaurant.region_name || undefined);

  // Use original image from popular_restaurants, fallback to localized image
  const imageUrl = restaurant.original_image_url || restaurant.image_url;

  // Build query params to maintain filter context
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (currentRegion) params.set('region', currentRegion);
    if (currentRegionDetail) params.set('region_detail', currentRegionDetail);
    if (currentRegionDetailName) params.set('region_detail_name', currentRegionDetailName);
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  const queryParams = buildQueryParams();

  return (
    <Link href={`/restaurants/${slug}${queryParams}`} className="group block">
      <article className="bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Image Section */}
        {imageUrl && (
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={restaurant.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              priority={priority}
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {restaurant.category_translated && (
              <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full tracking-wide">
                {restaurant.category_translated}
              </span>
            )}
            {restaurant.region_name && (
              <span className="inline-block px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-full uppercase tracking-wider">
                {restaurant.region_name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors duration-200">
            {restaurant.name}
          </h3>

          {/* Description */}
          {restaurant.summary_short && (
            <p className="text-base text-gray-600 leading-relaxed line-clamp-3">
              {restaurant.summary_short}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
