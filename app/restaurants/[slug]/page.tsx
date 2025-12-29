import { notFound } from 'next/navigation';
import { getFullRestaurantById, getRestaurants } from '@/lib/data/restaurants';
import GlossarySection from '@/components/GlossarySection';
import ImageCarousel from '@/components/ImageCarousel';
import MenuImageGallery from '@/components/MenuImageGallery';
import GoogleMap from '@/components/GoogleMap';
import TextWithGlossary from '@/components/TextWithGlossary';
import Image from 'next/image';
import type { Metadata } from 'next';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RestaurantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getFullRestaurantById(slug);

  if (!restaurant) {
    return {
      title: 'Restaurant Not Found - KoreaNow',
    };
  }

  const imageUrl = restaurant.original_image_url || restaurant.image_url;

  return {
    title: `${restaurant.name}`,
    description: restaurant.summary_short || `Discover ${restaurant.name} in Korea`,
    alternates: {
      canonical: `https://koreanow.app/restaurants/${slug}`,
    },
    openGraph: {
      type: 'website',
      title: restaurant.name,
      description: restaurant.summary_short || `Discover ${restaurant.name} in Korea`,
      url: `https://koreanow.app/restaurants/${slug}`,
      siteName: 'KoreaNow',
      locale: 'en_US',
      images: imageUrl ? [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: restaurant.name,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: restaurant.name,
      description: restaurant.summary_short || `Discover ${restaurant.name} in Korea`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const restaurant = await getFullRestaurantById(slug);

  if (!restaurant) {
    notFound();
  }

  // Helper function to safely convert to string with line breaks
  const toHtmlString = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value.replace(/\n/g, '<br />');

    // Handle arrays
    if (Array.isArray(value)) {
      // Check if array contains objects (like menu items)
      if (value.length > 0 && typeof value[0] === 'object') {
        // Menu format: {name, price}
        if ('name' in value[0]) {
          return value.map(item => {
            if ('price' in item && item.price) {
              return `${item.name} — ${item.price}`;
            }
            return item.name;
          }).join('<br />');
        }
        // Other object arrays - convert to JSON
        return value.map(item => JSON.stringify(item)).join('<br />');
      }
      // Simple arrays (strings, etc.)
      return value.join('<br />');
    }

    // Handle objects
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2).replace(/\n/g, '<br />');
    }

    return String(value).replace(/\n/g, '<br />');
  };

  // Merge glossaries from header and detail
  // Handle both array and object formats
  let combinedGlossary: any = {};

  if (Array.isArray(restaurant.glossary)) {
    combinedGlossary = restaurant.glossary;
  } else if (restaurant.glossary) {
    combinedGlossary = { ...restaurant.glossary };
  }

  // If detail glossary exists and is an array, merge it
  if (restaurant.detail?.glossary) {
    if (Array.isArray(restaurant.detail.glossary)) {
      if (Array.isArray(combinedGlossary)) {
        // Merge two arrays, avoiding duplicates
        const existingTerms = new Set(combinedGlossary.map((item: any) => item.term));
        const newEntries = restaurant.detail.glossary.filter(
          (item: any) => !existingTerms.has(item.term)
        );
        combinedGlossary = [...combinedGlossary, ...newEntries];
      } else {
        // Convert object to array and merge
        const objEntries = Object.entries(combinedGlossary).map(([term, explain]) => ({
          term,
          explain: explain as string,
        }));
        combinedGlossary = [...objEntries, ...restaurant.detail.glossary];
      }
    } else {
      // Merge objects
      if (!Array.isArray(combinedGlossary)) {
        combinedGlossary = { ...combinedGlossary, ...restaurant.detail.glossary };
      }
    }
  }

  // Prepare images for carousel - prioritize raw detail images, fallback to header images
  const images = restaurant.detailRaw?.image_urls && restaurant.detailRaw.image_urls.length > 0
    ? restaurant.detailRaw.image_urls
    : [restaurant.original_image_url || restaurant.image_url].filter((img): img is string => Boolean(img));

  // Get the original URL for the source link
  const sourceUrl = restaurant.original_url || restaurant.url;

  // Generate Schema.org JSON-LD for Restaurant
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.detail?.name_translated || restaurant.name,
    description: restaurant.summary_short || restaurant.detail?.summary_short || `Discover ${restaurant.name} in Korea`,
    image: images.length > 0 ? images : undefined,
    address: restaurant.detail?.address_translated ? {
      '@type': 'PostalAddress',
      streetAddress: restaurant.detail.address_translated,
      addressCountry: 'KR',
    } : undefined,
    geo: restaurant.detail?.geo_w && restaurant.detail?.geo_g ? {
      '@type': 'GeoCoordinates',
      latitude: restaurant.detail.geo_w,
      longitude: restaurant.detail.geo_g,
    } : undefined,
    url: `https://koreanow.app/restaurants/${slug}`,
    servesCuisine: 'Korean',
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section with Image Carousel */}
      {images.length > 0 && (
        <div className="relative">
          <ImageCarousel images={images} alt={restaurant.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                {restaurant.detail?.name_translated || restaurant.name}
              </h1>
              {restaurant.detail?.summary_short && (
                <p className="text-xl text-white/90 mb-4 drop-shadow-md max-w-2xl">
                  <TextWithGlossary
                    text={String(restaurant.detail.summary_short)}
                    glossary={combinedGlossary}
                  />
                </p>
              )}
              <div className="flex gap-2">
                {restaurant.region_name && (
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full pointer-events-auto">
                    {restaurant.region_name}
                  </span>
                )}
                {restaurant.detail?.category_translated && (
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full pointer-events-auto">
                    {restaurant.detail.category_translated}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rating & Social Proof */}
        {restaurant.detailRaw?.rating && (
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(restaurant.detailRaw!.rating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                {restaurant.detailRaw.rating.toFixed(1)}
              </span>
            </div>
            {restaurant.detailRaw.rating_count && (
              <span className="text-gray-600">
                ({restaurant.detailRaw.rating_count.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}

        {/* Editorial Introduction */}
        {restaurant.detail?.description_translated && (
          <div className="mb-12">
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              <TextWithGlossary
                text={String(restaurant.detail.description_translated)}
                glossary={combinedGlossary}
              />
            </div>
          </div>
        )}

        {/* Key Highlights */}
        {restaurant.detail?.summary_bullets && restaurant.detail.summary_bullets.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Local Tips
            </h2>
            <ul className="space-y-3">
              {restaurant.detail.summary_bullets.map((bullet, idx) => (
                <li key={idx} className="text-gray-700 flex items-start">
                  <span className="text-gray-400 mr-3 mt-1">•</span>
                  <span className="flex-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Menu Section */}
        {(restaurant.detail?.menus_translated || restaurant.menu) && (
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Menu
            </h2>

            {/* Menu Images Gallery */}
            {restaurant.detailRaw?.image_urls && restaurant.detailRaw.image_urls.length > 0 && (
              <MenuImageGallery
                images={restaurant.detailRaw.image_urls}
                restaurantName={restaurant.name}
              />
            )}

            {/* Menu List */}
            {Array.isArray(restaurant.detail?.menus_translated) &&
             restaurant.detail.menus_translated.length > 0 &&
             restaurant.detail.menus_translated[0]?.name ? (
              <div className="space-y-1">
                {restaurant.detail.menus_translated.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-baseline py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <span className="text-gray-800 flex-1 leading-relaxed group-hover:text-gray-900">
                      <TextWithGlossary
                        text={String(item.name)}
                        glossary={combinedGlossary}
                      />
                    </span>
                    {item.price && (
                      <span className="text-gray-900 font-semibold ml-6 whitespace-nowrap">
                        {item.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                <TextWithGlossary
                  text={String(restaurant.detail?.menus_translated || restaurant.menu || '')}
                  glossary={combinedGlossary}
                />
              </div>
            )}
          </div>
        )}

        {/* Practical Information */}
        {(restaurant.detail?.address_translated ||
          restaurant.address ||
          restaurant.detail?.category_translated ||
          restaurant.detail?.operating_hours_translated ||
          restaurant.detail?.facilities_translated ||
          restaurant.detailRaw?.phone ||
          restaurant.detailRaw?.website) && (
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Practical Information
            </h2>
            <dl className="space-y-4">
              {restaurant.detail?.category_translated && (
                <div>
                  <dt className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">
                    Category
                  </dt>
                  <dd className="text-gray-700">
                    {restaurant.detail.category_translated}
                  </dd>
                </div>
              )}
              {(restaurant.detail?.address_translated || restaurant.address) && (
                <div>
                  <dt className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">
                    Address
                  </dt>
                  <dd className="text-gray-700">
                    {restaurant.detail?.address_translated || restaurant.address}
                  </dd>
                  {/* Google Map */}
                  {restaurant.detail?.geo_w && restaurant.detail?.geo_g && (
                    <div className="mt-4">
                      <GoogleMap
                        lat={restaurant.detail.geo_w}
                        lng={restaurant.detail.geo_g}
                        name={restaurant.name}
                        address={restaurant.detail.address_translated || restaurant.address}
                      />
                    </div>
                  )}
                </div>
              )}
              {restaurant.detail?.operating_hours_translated && (
                <div>
                  <dt className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">
                    Operating Hours
                  </dt>
                  <dd className="text-gray-700">
                    <TextWithGlossary
                      text={String(restaurant.detail.operating_hours_translated)}
                      glossary={combinedGlossary}
                    />
                  </dd>
                </div>
              )}
              {restaurant.detailRaw?.phone && (
                <div>
                  <dt className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">
                    Phone
                  </dt>
                  <dd className="text-gray-700">
                    <a href={`tel:${restaurant.detailRaw.phone}`} className="hover:text-gray-900">
                      {restaurant.detailRaw.phone}
                    </a>
                  </dd>
                </div>
              )}
              {restaurant.detailRaw?.website && (
                <div>
                  <dt className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">
                    Website
                  </dt>
                  <dd className="text-gray-700">
                    <a
                      href={restaurant.detailRaw.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-900 underline"
                    >
                      Visit Website →
                    </a>
                  </dd>
                </div>
              )}
              {restaurant.detail?.facilities_translated && (
                <div>
                  <dt className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">
                    Facilities
                  </dt>
                  <dd className="text-gray-700">
                    <TextWithGlossary
                      text={String(restaurant.detail.facilities_translated)}
                      glossary={combinedGlossary}
                    />
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Glossary */}
        {((Array.isArray(combinedGlossary) && combinedGlossary.length > 0) ||
          (!Array.isArray(combinedGlossary) && Object.keys(combinedGlossary).length > 0)) && (
          <GlossarySection glossary={combinedGlossary} />
        )}

        {/* Source Link */}
        {sourceUrl && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              View Original Source →
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
