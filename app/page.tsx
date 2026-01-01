import { getFeaturedEditorials } from "@/lib/data/editorials";
import { getRestaurants, getRegions } from "@/lib/data/restaurants";
import { getFeaturedYouTubeVideos } from "@/lib/data/youtube";
import { getFeaturedBlackWhiteChefEpisodes } from "@/lib/data/blackWhiteChef";
import EditorialCard from "@/components/EditorialCard";
import RestaurantCard from "@/components/RestaurantCard";
import YouTubeCard from "@/components/YouTubeCard";
import BlackWhiteChefSection from "@/components/BlackWhiteChefSection";
import RegionFilter from "@/components/RegionFilter";
import RegionExplorer from "@/components/RegionExplorer";
import Link from "next/link";
import type { Metadata } from "next";

export const runtime = "edge";
export const revalidate = 1800; // Revalidate every 30 minutes

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://koreanow.app',
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  const selectedRegion = params.region;

  const [featuredEditorials, trendingRestaurants, regions, featuredVideos, blackWhiteChefEpisodes] =
    await Promise.all([
      getFeaturedEditorials(2),
      getRestaurants(9, selectedRegion),
      getRegions(),
      getFeaturedYouTubeVideos(5),
      getFeaturedBlackWhiteChefEpisodes(4),
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

      {/* Black White Chef Special Section */}
      <BlackWhiteChefSection episodes={blackWhiteChefEpisodes} />

      {/* Explore by Region - CTA Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <RegionExplorer regions={regions} />

          {/* Divider */}
          <div className="relative my-20">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 bg-white text-gray-500 uppercase tracking-wider font-medium">
                Or explore popular regions
              </span>
            </div>
          </div>

          {/* Popular Region Cards - 3 columns for better spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {["SEOUL", "BUSAN", "JEJU"].map((region) => {
              const displayName =
                region.charAt(0) + region.slice(1).toLowerCase();
              const regionDescriptions: Record<string, string> = {
                SEOUL:
                  "From trendy Gangnam to authentic Gangbuk — Seoul has it all",
                BUSAN:
                  "Fresh seafood and coastal flavors in Korea's second-largest city",
                JEJU: "Island cuisine with the freshest ingredients from land and sea",
              };

              return (
                <Link
                  key={region}
                  href={`/restaurants?region=${region}`}
                  className="group relative bg-white rounded-xl p-10 hover:bg-gray-900 transition-all duration-300 hover:shadow-2xl border-2 border-gray-200 hover:border-gray-900"
                >
                  <div className="space-y-6">
                    {/* Region Icon/Badge */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white/20 transition-colors">
                      <svg
                        className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>

                    {/* Region Name */}
                    <h3 className="text-3xl font-serif font-bold text-gray-900 group-hover:text-white transition-colors">
                      {displayName}
                      {region === "SEOUL" && (
                        <span className="block mt-2 text-sm font-normal text-gray-500 group-hover:text-gray-300">
                          (Gangnam + Gangbuk)
                        </span>
                      )}
                    </h3>

                    {/* Description */}
                    <p className="text-base text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors min-h-[48px]">
                      {regionDescriptions[region]}
                    </p>

                    {/* Arrow Icon */}
                    <div className="flex items-center gap-2 text-gray-700 group-hover:text-white transition-colors pt-4">
                      <span className="text-sm font-semibold uppercase tracking-wider">
                        Explore
                      </span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-2 transition-transform"
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
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All Regions Button */}
          <div className="text-center">
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>View All Regions</span>
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
            <div className="mb-12 bg-white rounded-xl border-2 border-gray-200 p-6 md:p-8 shadow-sm">
              <RegionFilter regions={regions} currentRegion={selectedRegion} />
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingRestaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  priority={index < 3}
                />
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

      {/* Trending Korean Food Videos */}
      {featuredVideos.length > 0 && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <span className="inline-flex items-center px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold border border-red-200">
                    Trending Now
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                  Watch What&apos;s Trending in Korean Food
                </h2>
                <p className="text-lg text-gray-600 mt-3 max-w-2xl">
                  From mukbang to street food tours — see what Korea is watching
                  right now
                </p>
              </div>
              <Link
                href="/videos"
                className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                View All →
              </Link>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredVideos.map((video) => (
                <YouTubeCard key={video.id} video={video} />
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center">
              <Link
                href="/videos"
                className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Watch All 100 Videos</span>
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
              {featuredEditorials.map((editorial, index) => (
                <EditorialCard
                  key={editorial.id}
                  editorial={editorial}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Korean Food Glossary Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <svg
                className="w-8 h-8 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              New to Korean Food?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn the essential Korean food terms to navigate menus like a
              local
            </p>
          </div>

          {/* Featured Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                term: "Kimchi",
                definition:
                  "Fermented vegetables, usually napa cabbage, seasoned with chili pepper and garlic",
              },
              {
                term: "Banchan",
                definition:
                  "Small side dishes served along with rice in Korean meals",
              },
              {
                term: "Gochujang",
                definition:
                  "Fermented red chili paste, a staple Korean condiment",
              },
              {
                term: "Makgeolli",
                definition:
                  "Traditional Korean rice wine with a milky, slightly sweet taste",
              },
              {
                term: "Samgyeopsal",
                definition:
                  "Grilled pork belly, often enjoyed with lettuce wraps and ssamjang",
              },
              {
                term: "Bibimbap",
                definition:
                  "Mixed rice with vegetables, meat, egg, and gochujang sauce",
              },
            ].map((item) => (
              <div
                key={item.term}
                className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border-2 border-gray-200 hover:border-gray-300"
              >
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                  {item.term}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>

          {/* CTA to Full Glossary */}
          <div className="text-center">
            <Link
              href="/glossary"
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Explore Full Food Glossary</span>
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
            <p className="mt-4 text-sm text-gray-500">
              Over 50+ Korean food terms explained in plain English
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
