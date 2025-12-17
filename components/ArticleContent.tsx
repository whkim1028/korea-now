'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ArticleContentProps {
  content: string;
  images?: string[];
}

export default function ArticleContent({ content, images = [] }: ArticleContentProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Split content by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());

  // Calculate where to insert images (evenly distributed between paragraphs)
  // Map: paragraphIndex -> array of image indices to show after that paragraph
  const imagePositions = new Map<number, number[]>();
  if (images.length > 0 && paragraphs.length > 1) {
    for (let i = 0; i < images.length; i++) {
      const position = Math.floor((paragraphs.length / (images.length + 1)) * (i + 1));
      if (!imagePositions.has(position)) {
        imagePositions.set(position, []);
      }
      imagePositions.get(position)!.push(i);
    }
  }

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      <article className="prose prose-lg max-w-none">
        <div className="space-y-6">
          {paragraphs.map((paragraph, idx) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Split by single newline to preserve line breaks within paragraph
            const lines = trimmed.split('\n');

            // Find if images should be placed after this paragraph
            const imagesToShow = imagePositions.get(idx) || [];

            return (
              <div key={idx}>
                <p className="text-lg text-gray-800 leading-relaxed">
                  {lines.map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {line}
                      {lineIdx < lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>

                {/* Insert images after this paragraph */}
                {imagesToShow.map((imageIndex) => (
                  <button
                    key={imageIndex}
                    onClick={() => openModal(imageIndex)}
                    className="group relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 cursor-pointer transition-all hover:shadow-xl my-8 block"
                  >
                    <Image
                      src={images[imageIndex]}
                      alt={`Article image ${imageIndex + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    {/* Zoom icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <svg
                          className="w-6 h-6 text-gray-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </article>

      {/* Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          {selectedImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Previous image"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {selectedImageIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Next image"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-6xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImageIndex]}
              alt={`Article image ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
