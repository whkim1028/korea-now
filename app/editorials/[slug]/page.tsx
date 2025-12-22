import { notFound } from 'next/navigation';
import { getFullEditorialById, getEditorials } from '@/lib/data/editorials';
import GlossarySection from '@/components/GlossarySection';
import ArticleContent from '@/components/ArticleContent';
import Image from 'next/image';
import type { Metadata } from 'next';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface EditorialPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EditorialPageProps): Promise<Metadata> {
  const id = params.slug;

  const editorial = await getFullEditorialById(id);

  if (!editorial) {
    return {
      title: 'Editorial Not Found - KoreaNow',
    };
  }

  return {
    title: `${editorial.title_translated}`,
    description: editorial.summary_short || editorial.summary_translated,
    openGraph: {
      type: 'article',
      title: editorial.title_translated,
      description: editorial.summary_short || editorial.summary_translated || '',
      url: `https://koreanow.pages.dev/editorials/${id}`,
      siteName: 'KoreaNow',
      locale: 'en_US',
      images: editorial.image_url ? [{
        url: editorial.image_url,
        width: 1200,
        height: 630,
        alt: editorial.title_translated,
      }] : [],
      publishedTime: editorial.created_at,
      modifiedTime: editorial.updated_at || editorial.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: editorial.title_translated,
      description: editorial.summary_short || editorial.summary_translated || '',
      images: editorial.image_url ? [editorial.image_url] : [],
    },
  };
}

export default async function EditorialPage({ params }: EditorialPageProps) {
  const id = params.slug;

  const editorial = await getFullEditorialById(id);

  if (!editorial) {
    notFound();
  }

  // Merge glossaries from header and content
  const combinedGlossary = {
    ...(editorial.glossary || {}),
    ...(editorial.content?.glossary || {}),
  };

  // Generate Schema.org JSON-LD for Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: editorial.title_translated,
    description: editorial.summary_short || editorial.summary_translated || '',
    image: editorial.image_url ? [editorial.image_url] : undefined,
    datePublished: editorial.created_at,
    dateModified: editorial.updated_at || editorial.created_at,
    author: {
      '@type': 'Organization',
      name: 'KoreaNow',
      url: 'https://koreanow.pages.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KoreaNow',
      url: 'https://koreanow.pages.dev',
    },
    url: `https://koreanow.pages.dev/editorials/${id}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://koreanow.pages.dev/editorials/${id}`,
    },
    articleBody: editorial.content?.content_translated || editorial.summary_translated,
    keywords: editorial.summary_bullets ? editorial.summary_bullets.join(', ') : 'Korean food, Korean culture, Korea',
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {editorial.title_translated}
          </h1>

          {editorial.summary_short && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {editorial.summary_short}
            </p>
          )}

          {editorial.summary_bullets && editorial.summary_bullets.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Key Highlights
              </h2>
              <ul className="space-y-3">
                {editorial.summary_bullets.map((bullet, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span className="flex-1">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {editorial.content?.content_summary && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-gray-900">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">{editorial.content.content_summary}</p>
          </div>
        )}

        {editorial.content?.content_translated && (
          <ArticleContent
            content={editorial.content.content_translated}
            images={editorial.content.images}
            glossary={combinedGlossary}
          />
        )}

        {editorial.content?.content_bullets && editorial.content.content_bullets.length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">
              Summary
            </h2>
            <ul className="space-y-2">
              {editorial.content.content_bullets.map((bullet, idx) => (
                <li key={idx} className="text-gray-700 flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Glossary */}
        <GlossarySection glossary={combinedGlossary} />

        {/* Source Link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href={editorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            View Original Source →
          </a>
        </div>
      </div>
    </article>
  );
}
