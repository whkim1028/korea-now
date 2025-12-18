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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
              Restaurants
            </h1>
            <RegionFilter regions={regions} currentRegion={selectedRegion} />
          </div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            Trending restaurants loved by locals. From hidden gems to must-visit spots.
          </p>

          {selectedRegion && (
            <p className="text-sm text-gray-600 mt-4">
              Showing restaurants in{' '}
              <span className="font-medium">
                {selectedRegion.charAt(0) + selectedRegion.slice(1).toLowerCase()}
              </span>
              {selectedRegion === 'SEOUL' && ' (Gangnam + Gangbuk)'}
            </p>
          )}
        </div>

        {/* Restaurant Grid */}
        {restaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {selectedRegion
                ? `No restaurants found in ${selectedRegion.charAt(0) + selectedRegion.slice(1).toLowerCase()}.`
                : 'No restaurants available yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
