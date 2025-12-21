import { getRestaurants, getRegions } from '@/lib/data/restaurants';
import RestaurantCard from '@/components/RestaurantCard';
import RegionFilter from '@/components/RegionFilter';
import Link from 'next/link';
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
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <RegionFilter regions={regions} currentRegion={selectedRegion} />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Results Count & Status */}
        <div className="mb-10 bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Results Info */}
            <div>
              {selectedRegion ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Showing</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold bg-gray-900 text-white shadow-md">
                      {restaurants.length}
                    </span>
                    <span className="text-sm text-gray-600">
                      {restaurants.length === 1 ? 'restaurant' : 'restaurants'} in
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-semibold bg-gray-100 text-gray-900 border-2 border-gray-300">
                      {selectedRegion.charAt(0) + selectedRegion.slice(1).toLowerCase()}
                      {selectedRegion === 'SEOUL' && ' (Gangnam + Gangbuk)'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Filter applied — showing region-specific results
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold bg-gray-900 text-white shadow-md">
                      {restaurants.length}
                    </span>
                    <span className="text-sm text-gray-600">restaurants across all regions</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Use the filter above to narrow down by region
                  </p>
                </div>
              )}
            </div>

            {/* Right: Clear Filter Button */}
            {selectedRegion && (
              <Link
                href="/restaurants"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filter
              </Link>
            )}
          </div>
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
