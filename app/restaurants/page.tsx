import { getRestaurants, getRegions } from '@/lib/data/restaurants';
import RestaurantCard from '@/components/RestaurantCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurants - KoreaNow',
  description: 'Discover trending restaurants in Korea. Real local favorites curated for you.',
};

export default async function RestaurantsPage() {
  const [restaurants, regions] = await Promise.all([
    getRestaurants(),
    getRegions(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Restaurants
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            Trending restaurants loved by locals. From hidden gems to must-visit spots.
          </p>
        </div>

        {/* Regions (for future filtering) */}
        {regions.length > 0 && (
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Regions
            </h2>
            <div className="flex flex-wrap gap-3">
              {regions.map((region) => (
                <span
                  key={region}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Restaurant Grid */}
        {restaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No restaurants available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.url} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
