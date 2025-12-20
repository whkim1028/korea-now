import { getRestaurants, getRegions } from '@/lib/data/restaurants';
import RestaurantCard from '@/components/RestaurantCard';
import RegionFilter from '@/components/RegionFilter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurants - KoreaNow',
  description: 'Discover trending restaurants in Korea. Real local favorites curated for you.',
};

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  const selectedRegion = params.region;

  const [restaurants, regions] = await Promise.all([
    getRestaurants(undefined, selectedRegion),
    getRegions(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-4">
            Restaurants
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            Trending restaurants loved by locals. From hidden gems to must-visit spots.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <RegionFilter regions={regions} currentRegion={selectedRegion} />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count & Status */}
        <div className="mb-8">
          {selectedRegion ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-900 text-white">
                {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'}
              </span>
              <span className="text-sm text-gray-600">in</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-900">
                {selectedRegion.charAt(0) + selectedRegion.slice(1).toLowerCase()}
                {selectedRegion === 'SEOUL' && ' (Gangnam + Gangbuk)'}
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{restaurants.length}</span> restaurants across all regions
            </p>
          )}
        </div>

        {/* Restaurant Grid */}
        {restaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">
              {selectedRegion
                ? `No restaurants found in ${selectedRegion.charAt(0) + selectedRegion.slice(1).toLowerCase()}.`
                : 'No restaurants available yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
