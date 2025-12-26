import Image from 'next/image';
import Link from 'next/link';
import EpisodeCard from './EpisodeCard';
import type { BlackWhiteChefCard } from '@/types/blackWhiteChef';

interface BlackWhiteChefSectionProps {
  episodes: BlackWhiteChefCard[];
}

export default function BlackWhiteChefSection({ episodes }: BlackWhiteChefSectionProps) {
  if (episodes.length === 0) {
    return null;
  }

  return (
    <section id="black-white-chef" className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[700px]">
          {/* Left: Poster */}
          <div className="lg:col-span-2 relative p-6 lg:p-8 py-8 lg:py-12">
            <div className="relative h-[500px] lg:h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
              <Image
                src="/black_white_chef/main_poster.gif"
                alt="Black White Chef - Season 2"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

        {/* Right: Content */}
        <div className="lg:col-span-3 relative">
          <div className="h-full flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-20 py-16 lg:py-20">
            {/* Header */}
            <div className="mb-10">
              {/* Meta Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full tracking-wide">
                  FEATURED SERIES
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  Season 2 · Episodes 2-4
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-[1.1]">
                From Screen<br className="hidden sm:block" /> to Table
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed mb-4">
                Discover real Korean regional foods you saw on screen — and where locals actually eat them.
              </p>

              {/* Context */}
              <p className="text-sm text-gray-500 italic">
                흑백요리사: 요리 계급 전쟁<br />
                <span className="text-xs not-italic">(Black White Chef: The Culinary Class Wars)</span>
              </p>
            </div>

            {/* Episode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>

            {/* View All Episodes CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/episodes"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>View All Episodes</span>
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
              <span className="text-sm text-gray-500">
                {episodes.length} featured · More available
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </section>
  );
}
