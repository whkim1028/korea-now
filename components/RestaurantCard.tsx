import Link from 'next/link';
import Image from 'next/image';
import type { RestaurantTranslation } from '@/types/database';

interface RestaurantCardProps {
  restaurant: RestaurantTranslation;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // Use restaurant ID as slug
  const slug = restaurant.id;

  // Use original image from popular_restaurants, fallback to localized image
  const imageUrl = restaurant.original_image_url || restaurant.image_url;

  return (
    <Link href={`/restaurants/${slug}`} className="group block">
      <article className="relative overflow-hidden rounded-sm">
        {imageUrl && (
          <div className="relative w-full h-80 overflow-hidden">
            <Image
              src={imageUrl}
              alt={restaurant.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="image-overlay-dark" />

            {/* Text overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white leading-tight group-hover:text-gray-100 transition-colors">
                  {restaurant.name}
                </h3>
                {restaurant.region_name && (
                  <span className="inline-block px-2 py-1 text-xs text-white bg-white/20 backdrop-blur-sm rounded uppercase tracking-wide">
                    {restaurant.region_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </Link>
  );
}
