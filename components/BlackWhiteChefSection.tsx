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
    <section id="black-white-chef" className="relative bg-white border-y border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* 2-Column Layout: Poster Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Poster (Fixed on Desktop, Top on Mobile) */}
          <div className="lg:col-span-4 relative h-[400px] lg:h-[700px]">
            <Image
              src="/black_white_chef/main_poster.gif"
              alt="Black White Chef - Season 2"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            {/* Overlay for better text contrast on mobile */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 lg:hidden" />
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-8 px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
            {/* Header */}
            <div className="mb-12">
              {/* Meta Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
                  Featured
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Season 2 · Episodes 2-4 · Regional Battles
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                From Screen to Table
              </h2>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Discover real Korean regional foods you saw on screen — and where locals actually eat them.
              </p>

              {/* Context */}
              <p className="text-sm text-gray-500 mt-3 italic">
                As featured in 흑백요리사: 요리 계급 전쟁 (Black White Chef: The Culinary Class Wars)
              </p>
            </div>

            {/* Episode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>

            {/* View All Episodes CTA */}
            <div className="text-center">
              <Link
                href="/episodes"
                className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
