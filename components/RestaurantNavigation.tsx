import Link from 'next/link';
import Image from 'next/image';
import type { RestaurantTranslation } from '@/types/database';
import { generateRestaurantSlug } from '@/lib/utils/slug';

interface RestaurantNavigationProps {
  prev: RestaurantTranslation | null;
  next: RestaurantTranslation | null;
  region?: string;
  regionDetail?: string;
  regionDetailName?: string;
}

export default function RestaurantNavigation({
  prev,
  next,
  region,
  regionDetail,
  regionDetailName,
}: RestaurantNavigationProps) {
  // If neither prev nor next exists, don't render anything
  if (!prev && !next) {
    return null;
  }

  // Build query params to maintain filter context
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (region) params.set('region', region);
    if (regionDetail) params.set('region_detail', regionDetail);
    if (regionDetailName) params.set('region_detail_name', regionDetailName);
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  const queryParams = buildQueryParams();

  return (
    <div className="border-t border-gray-200 pt-12 mt-12">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">
        More Restaurants
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Previous Restaurant */}
        {prev ? (
          <Link
            href={`/restaurants/${generateRestaurantSlug(prev.name, prev.region_name || undefined)}${queryParams}`}
            className="group block bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-gray-900 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 p-4">
              {/* Arrow Icon */}
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>

              {/* Image */}
              {(prev.original_image_url || prev.image_url) && (
                <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={prev.original_image_url || prev.image_url || ''}
                    alt={prev.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Previous
                </p>
                <h3 className="text-lg font-serif font-bold text-gray-900 leading-tight truncate group-hover:text-gray-600 transition-colors">
                  {prev.name}
                </h3>
                {prev.region_name && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {prev.region_name}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-50 border-2 border-gray-100 rounded-lg p-4 flex items-center justify-center">
            <p className="text-gray-400 text-sm">No previous restaurant</p>
          </div>
        )}

        {/* Next Restaurant */}
        {next ? (
          <Link
            href={`/restaurants/${generateRestaurantSlug(next.name, next.region_name || undefined)}${queryParams}`}
            className="group block bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-gray-900 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 p-4">
              {/* Content */}
              <div className="flex-1 min-w-0 text-right md:order-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Next
                </p>
                <h3 className="text-lg font-serif font-bold text-gray-900 leading-tight truncate group-hover:text-gray-600 transition-colors">
                  {next.name}
                </h3>
                {next.region_name && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {next.region_name}
                  </p>
                )}
              </div>

              {/* Image */}
              {(next.original_image_url || next.image_url) && (
                <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100 md:order-3">
                  <Image
                    src={next.original_image_url || next.image_url || ''}
                    alt={next.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Arrow Icon */}
              <div className="flex-shrink-0 md:order-4">
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-50 border-2 border-gray-100 rounded-lg p-4 flex items-center justify-center">
            <p className="text-gray-400 text-sm">No next restaurant</p>
          </div>
        )}
      </div>
    </div>
  );
}
