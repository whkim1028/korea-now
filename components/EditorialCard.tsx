import Link from 'next/link';
import Image from 'next/image';
import type { EditorialTranslation } from '@/types/database';
import { generateEditorialSlug } from '@/lib/utils/slug';

interface EditorialCardProps {
  editorial: EditorialTranslation;
  featured?: boolean;
}

export default function EditorialCard({ editorial, featured = false }: EditorialCardProps) {
  // Generate SEO-friendly slug from title
  const slug = generateEditorialSlug(editorial.title_translated);

  // Use original image from food_editorial_posts, fallback to translated image
  const imageUrl = editorial.original_image_url || editorial.image_url;

  // Don't render if no title (needed for slug)
  if (!editorial.title_translated || !slug) {
    return null;
  }

  if (featured) {
    return (
      <Link href={`/editorials/${slug}`} className="group block">
        <article className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image - Left Side */}
          {imageUrl && (
            <div className="relative w-full aspect-square overflow-hidden rounded-sm">
              <Image
                src={imageUrl}
                alt={editorial.title_translated}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="image-overlay-hover" />
            </div>
          )}

          {/* Content - Right Side */}
          <div className="flex flex-col justify-center space-y-6 py-8 md:py-0">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                {editorial.title_translated}
              </h2>
              {editorial.summary_short && (
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed line-clamp-4">
                  {editorial.summary_short}
                </p>
              )}
            </div>
            <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
              Read More →
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/editorials/${slug}`} className="group block">
      <article className="space-y-4">
        {imageUrl && (
          <div className="relative w-full h-[300px] overflow-hidden rounded-sm">
            <Image
              src={imageUrl}
              alt={editorial.title_translated}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="image-overlay-hover" />
          </div>
        )}
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
            {editorial.title_translated}
          </h3>
          {editorial.summary_short && (
            <p className="text-base text-gray-600 line-clamp-2 leading-relaxed">
              {editorial.summary_short}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
