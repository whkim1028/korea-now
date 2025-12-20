import { getFeaturedEditorials } from "@/lib/data/editorials";
import { getRestaurants, getRegions } from "@/lib/data/restaurants";
import EditorialCard from "@/components/EditorialCard";
import RestaurantCard from "@/components/RestaurantCard";
import RegionFilter from "@/components/RegionFilter";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  const selectedRegion = params.region;

  const [featuredEditorials, trendingRestaurants, regions] = await Promise.all([
    getFeaturedEditorials(2),
    getRestaurants(9, selectedRegion),
    getRegions(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Site Introduction */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              What Koreans Are Really Eating — Right Now
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Not ads or sponsored picks — just places Koreans actually go.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Restaurants - Now First! */}
      {trendingRestaurants.length > 0 && (
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                Where Koreans Are Eating These Days
              </h2>
              <Link
                href={
                  selectedRegion
                    ? `/restaurants?region=${selectedRegion}`
                    : "/restaurants"
                }
                className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                View All →
              </Link>
            </div>

            {/* Filter Section */}
            <div className="mb-10">
              <RegionFilter regions={regions} currentRegion={selectedRegion} />
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>

            {/* View All Button - Bottom */}
            <div className="mt-12 flex justify-center">
              <Link
                href={
                  selectedRegion
                    ? `/restaurants?region=${selectedRegion}`
                    : "/restaurants"
                }
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>View All Restaurants</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Editorial Stories - Now Second */}
      {featuredEditorials.length > 0 && (
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                Latest Stories
              </h2>
              <Link
                href="/editorials"
                className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {featuredEditorials.map((editorial) => (
                <EditorialCard key={editorial.id} editorial={editorial} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
