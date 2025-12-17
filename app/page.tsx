import { getFeaturedEditorials } from '@/lib/data/editorials';
import { getRestaurants } from '@/lib/data/restaurants';
import EditorialCard from '@/components/EditorialCard';
import RestaurantCard from '@/components/RestaurantCard';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const [featuredEditorials, trendingRestaurants] = await Promise.all([
    getFeaturedEditorials(3),
    getRestaurants(6),
  ]);

  console.log('=== HOME PAGE DEBUG ===');
  console.log('Featured Editorials:', featuredEditorials.length);
  console.log('Trending Restaurants:', trendingRestaurants.length);
  console.log('First Restaurant:', {
    name: trendingRestaurants[0]?.name,
    image_url: trendingRestaurants[0]?.image_url,
    original_image_url: trendingRestaurants[0]?.original_image_url,
    restaurant_id: trendingRestaurants[0]?.restaurant_id,
  });

  const heroEditorial = featuredEditorials[0];
  const otherEditorials = featuredEditorials.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Site Introduction */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Discover What&apos;s Trending in Korea
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Experience Korean culture, food, and trends as they happen.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Editorial */}
      {heroEditorial && (
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <EditorialCard editorial={heroEditorial} featured />
          </div>
        </section>
      )}

      {/* More Editorials */}
      {otherEditorials.length > 0 && (
        <section className="border-b border-gray-100 bg-gray-50">
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
              {otherEditorials.map((editorial) => (
                <EditorialCard key={editorial.id} editorial={editorial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Restaurants */}
      {trendingRestaurants.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                Trending Restaurants
              </h2>
              <Link
                href="/restaurants"
                className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {trendingRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.url} restaurant={restaurant} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
