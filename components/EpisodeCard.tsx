import Link from 'next/link';
import AdaptiveImage from './AdaptiveImage';
import type { BlackWhiteChefCard } from '@/types/blackWhiteChef';

interface EpisodeCardProps {
  episode: BlackWhiteChefCard;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const episodeLink = `/episodes/${episode.id}`;

  return (
    <Link
      href={episodeLink}
      className="group block bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-lg transition-all duration-200"
    >
      {/* Image Placeholder */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {episode.thumbnail ? (
          <AdaptiveImage
            basePath={episode.thumbnail}
            alt={`${episode.regionDetailName} ${episode.ingredient}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            loading="lazy"
          />
        ) : (
          <div className="text-center text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs font-medium">Image Coming Soon</p>
          </div>
        )}

        {/* Episode Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
          Episode {episode.episode}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Region · Detail · Ingredient */}
        <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 leading-tight group-hover:text-gray-700 transition-colors">
          {episode.regionDetailName} · {episode.ingredient}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
          {episode.description}
        </p>

        {/* Chefs (Optional) */}
        {episode.chefs && (
          <p className="text-xs text-gray-500 mb-3 truncate">
            {episode.chefs}
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            View Episode Details
          </span>
          <svg
            className="w-5 h-5 text-gray-700 group-hover:text-gray-900 group-hover:translate-x-1 transition-all"
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
}
