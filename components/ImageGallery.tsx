'use client';

import { useState, useEffect } from 'react';
import AdaptiveImage from './AdaptiveImage';

interface ImageGalleryProps {
  regionName: string;
  imageCount?: number;
  chefNames?: string;
}

export default function ImageGallery({ regionName, imageCount = 3, chefNames }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev !== null && prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev !== null && prev < imageCount ? prev + 1 : prev));
  };

  // ESC key to close modal and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
      if (e.key === 'ArrowLeft' && selectedImage !== null && selectedImage > 1) {
        setSelectedImage(selectedImage - 1);
      }
      if (e.key === 'ArrowRight' && selectedImage !== null && selectedImage < imageCount) {
        setSelectedImage(selectedImage + 1);
      }
    };

    if (selectedImage !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, imageCount]);

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: imageCount }, (_, i) => i + 1).map((i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(i)}
            className="relative aspect-[4/3] bg-white/50 backdrop-blur-sm rounded-lg border-2 border-gray-300 overflow-hidden cursor-pointer hover:border-gray-500 transition-all group"
          >
            <AdaptiveImage
              basePath={`/black_white_chef/${regionName}/${i}`}
              alt={chefNames ? `${regionName} food battle featuring ${chefNames} - Scene ${i}` : `${regionName} Battle Scene ${i}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={85}
              loading="lazy"
            />
            {/* Zoom indicator */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          {/* Modal Content */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 md:-top-12 md:-right-12 p-2 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close"
            >
              <svg
                className="w-8 h-8 md:w-10 md:h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            {selectedImage > 1 && (
              <button
                onClick={handlePrevious}
                className="absolute left-2 md:left-4 p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {selectedImage < imageCount && (
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors z-10"
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full">
              <AdaptiveImage
                basePath={`/black_white_chef/${regionName}/${selectedImage}`}
                alt={chefNames ? `${regionName} Culinary Class Wars battle featuring ${chefNames}` : `${regionName} Battle Scene ${selectedImage}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 90vw"
                quality={90}
                priority
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {selectedImage} / {imageCount}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
