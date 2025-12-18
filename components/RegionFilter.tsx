'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface RegionFilterProps {
  regions: string[];
  currentRegion?: string;
}

export default function RegionFilter({ regions, currentRegion }: RegionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(currentRegion || '');

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setIsOpen(false);

    // Update URL with region parameter
    const params = new URLSearchParams(searchParams);
    if (region) {
      params.set('region', region);
    } else {
      params.delete('region');
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname, { scroll: false });
  };

  const displayText = selectedRegion
    ? selectedRegion.charAt(0) + selectedRegion.slice(1).toLowerCase()
    : 'All Regions';

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between min-w-[180px] px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
      >
        <span>{displayText}</span>
        <svg
          className={`ml-2 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute z-20 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              {/* All Regions Option */}
              <button
                onClick={() => handleRegionSelect('')}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  !selectedRegion ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700'
                }`}
              >
                All Regions
              </button>

              {/* Region Options */}
              {regions.map((region) => {
                const displayName = region.charAt(0) + region.slice(1).toLowerCase();
                const isSelected = selectedRegion === region;

                return (
                  <button
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      isSelected ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {displayName}
                    {region === 'SEOUL' && (
                      <span className="ml-2 text-xs text-gray-500">
                        (Gangnam + Gangbuk)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
