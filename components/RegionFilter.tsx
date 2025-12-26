'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';

interface RegionFilterProps {
  regions: string[];
  currentRegion?: string;
  regionDetails?: string[];
  currentRegionDetail?: string;
}

export default function RegionFilter({ regions, currentRegion, regionDetails = [], currentRegionDetail }: RegionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const [showDetailLeftShadow, setShowDetailLeftShadow] = useState(false);
  const [showDetailRightShadow, setShowDetailRightShadow] = useState(false);

  const handleRegionSelect = (region: string) => {
    // Update URL with region parameter
    const params = new URLSearchParams(searchParams);
    if (region) {
      params.set('region', region);
      // Clear region_detail_name when changing region
      params.delete('region_detail_name');
    } else {
      params.delete('region');
      params.delete('region_detail_name');
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname, { scroll: false });
  };

  const handleRegionDetailSelect = (regionDetail: string) => {
    // Update URL with region_detail_name parameter
    const params = new URLSearchParams(searchParams);
    if (regionDetail) {
      params.set('region_detail_name', regionDetail);
    } else {
      params.delete('region_detail_name');
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname, { scroll: false });
  };

  const formatRegionName = (region: string) => {
    return region.charAt(0) + region.slice(1).toLowerCase();
  };

  const checkScroll = () => {
    const element = scrollRef.current;
    if (!element) return;

    setShowLeftShadow(element.scrollLeft > 10);
    setShowRightShadow(
      element.scrollLeft < element.scrollWidth - element.clientWidth - 10
    );
  };

  const checkDetailScroll = () => {
    const element = detailScrollRef.current;
    if (!element) return;

    setShowDetailLeftShadow(element.scrollLeft > 10);
    setShowDetailRightShadow(
      element.scrollLeft < element.scrollWidth - element.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScroll();
    checkDetailScroll();
    window.addEventListener('resize', checkScroll);
    window.addEventListener('resize', checkDetailScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      window.removeEventListener('resize', checkDetailScroll);
    };
  }, [regionDetails]);

  return (
    <div className="w-full">
      {/* Filter Label with active indicator */}
      <div className="mb-5 md:mb-6 flex items-center gap-3">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">
          Filter by Region
        </h2>
        {currentRegion && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            <div className="h-2 w-2 rounded-full bg-gray-900 animate-pulse" />
            <span className="text-xs font-medium text-gray-700">Active</span>
          </div>
        )}
      </div>

      {/* Horizontal Scrollable Filter with Shadows */}
      <div className="relative -mx-4 sm:mx-0">
        {/* Left Shadow - PC only */}
        {showLeftShadow && (
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        )}

        {/* Right Shadow - PC only */}
        {showRightShadow && (
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide py-3 pb-5 px-4 sm:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* All Regions */}
          <button
            onClick={() => handleRegionSelect('')}
            className={`flex-shrink-0 px-6 py-3 md:px-7 md:py-3.5 rounded-full text-sm md:text-base font-semibold transition-all duration-200 touch-manipulation ${
              !currentRegion
                ? 'bg-gray-900 text-white shadow-xl ring-[3px] ring-gray-400'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              {!currentRegion && (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              All Regions
            </span>
          </button>

          {/* Individual Regions */}
          {regions.map((region) => {
            const isSelected = currentRegion === region;
            const displayName = formatRegionName(region);

            return (
              <button
                key={region}
                onClick={() => handleRegionSelect(region)}
                className={`flex-shrink-0 px-6 py-3 md:px-7 md:py-3.5 rounded-full text-sm md:text-base font-semibold transition-all duration-200 touch-manipulation ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-xl ring-[3px] ring-gray-400'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isSelected && (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">
                    {displayName}
                    {region === 'SEOUL' && (
                      <span className={`ml-1.5 text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        (Gangnam + Gangbuk)
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Scroll Hint */}
      {showRightShadow && (
        <div className="mt-4 sm:hidden">
          <p className="text-xs text-gray-500 flex items-center gap-1.5 px-4 sm:px-0">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>Swipe to see more regions</span>
          </p>
        </div>
      )}

      {/* Second Level Filter: Region Details */}
      {currentRegion && regionDetails.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          {/* Detail Filter Label */}
          <div className="mb-5 md:mb-6 flex items-center gap-3">
            <h3 className="text-sm md:text-base font-semibold text-gray-700">
              Filter by Detailed Area
            </h3>
            {currentRegionDetail && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-medium text-blue-700">Active</span>
              </div>
            )}
          </div>

          {/* Horizontal Scrollable Detail Filter */}
          <div className="relative -mx-4 sm:mx-0">
            {/* Left Shadow */}
            {showDetailLeftShadow && (
              <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            )}

            {/* Right Shadow */}
            {showDetailRightShadow && (
              <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            )}

            {/* Scrollable Container */}
            <div
              ref={detailScrollRef}
              onScroll={checkDetailScroll}
              className="flex gap-2 overflow-x-auto scrollbar-hide py-2 pb-4 px-4 sm:px-0"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* All Details (Clear filter) */}
              <button
                onClick={() => handleRegionDetailSelect('')}
                className={`flex-shrink-0 px-5 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 touch-manipulation ${
                  !currentRegionDetail
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {!currentRegionDetail && (
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  All Areas
                </span>
              </button>

              {/* Individual Detail Regions */}
              {regionDetails.map((detail) => {
                const isSelected = currentRegionDetail === detail;

                return (
                  <button
                    key={detail}
                    onClick={() => handleRegionDetailSelect(detail)}
                    className={`flex-shrink-0 px-5 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 touch-manipulation ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      {isSelected && (
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Scroll Hint for Details */}
          {showDetailRightShadow && (
            <div className="mt-3 sm:hidden">
              <p className="text-xs text-gray-500 flex items-center gap-1.5 px-4 sm:px-0">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Swipe to see more areas</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
