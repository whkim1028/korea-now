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
  const [showDetailFilter, setShowDetailFilter] = useState(true);

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

  return (
    <div className="w-full">
      {/* Compact Filter Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
        {/* Region Filter */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</span>
            {currentRegion && (
              <div className="h-1.5 w-1.5 rounded-full bg-gray-900" />
            )}
          </div>
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <button
              onClick={() => handleRegionSelect('')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                !currentRegion
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {regions.map((region) => {
              const isSelected = currentRegion === region;
              const displayName = formatRegionName(region);

              return (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {displayName}
                  {region === 'SEOUL' && (
                    <span className={`ml-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      (GN+GB)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Filter - Collapsible */}
        {currentRegion && regionDetails.length > 0 && (
          <div className="flex-1 mt-4 lg:mt-0 lg:pl-8 lg:border-l border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detailed Area</span>
              {currentRegionDetail && (
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              )}
              <button
                onClick={() => setShowDetailFilter(!showDetailFilter)}
                className="ml-auto lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${showDetailFilter ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div
              ref={detailScrollRef}
              className={`flex gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap scrollbar-hide transition-all ${
                showDetailFilter ? 'max-h-20 lg:max-h-40 opacity-100' : 'max-h-0 opacity-0 lg:max-h-40 lg:opacity-100'
              }`}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <button
                onClick={() => handleRegionDetailSelect('')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !currentRegionDetail
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                All
              </button>
              {regionDetails.map((detail) => {
                const isSelected = currentRegionDetail === detail;

                return (
                  <button
                    key={detail}
                    onClick={() => handleRegionDetailSelect(detail)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {detail}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
