import { notFound } from 'next/navigation';
import { getFullEditorialById, getEditorials } from '@/lib/data/editorials';
import GlossarySection from '@/components/GlossarySection';
import ArticleContent from '@/components/ArticleContent';
import Image from 'next/image';
import type { Metadata } from 'next';

interface EditorialPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all editorials
export async function generateStaticParams() {
  const editorials = await getEditorials();
  return editorials.map((editorial) => ({
    slug: editorial.id || '',
  })).filter(item => item.slug !== '');
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
    title: `${editorial.title_translated} - KoreaNow`,
    description: editorial.summary_short || editorial.summary_translated,
    openGraph: {
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

  return (
    <article className="min-h-screen bg-white">
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
