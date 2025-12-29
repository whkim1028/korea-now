'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface AdaptiveImageProps extends Omit<ImageProps, 'src'> {
  basePath: string; // e.g., "/black_white_chef/Taean/1"
  extensions?: string[]; // e.g., ['webp', 'jpg', 'png']
}

export default function AdaptiveImage({
  basePath,
  extensions = ['webp', 'jpg', 'jpeg', 'png'],
  alt,
  ...props
}: AdaptiveImageProps) {
  const [currentExtIndex, setCurrentExtIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // Try next extension
    if (currentExtIndex < extensions.length - 1) {
      setCurrentExtIndex(currentExtIndex + 1);
    } else {
      // All extensions failed
      setHasError(true);
    }
  };

  if (hasError) {
    // Placeholder when all extensions fail
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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
          <p className="text-xs font-medium">Image not available</p>
        </div>
      </div>
    );
  }

  const currentSrc = `${basePath}.${extensions[currentExtIndex]}`;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
