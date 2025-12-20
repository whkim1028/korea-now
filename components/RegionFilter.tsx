'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface RegionFilterProps {
  regions: string[];
  currentRegion?: string;
}

export default function RegionFilter({ regions, currentRegion }: RegionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRegionSelect = (region: string) => {
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

  const formatRegionName = (region: string) => {
    return region.charAt(0) + region.slice(1).toLowerCase();
  };

  return (
    <div className="w-full">
      {/* Filter Label */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
          Filter by Region
        </h2>
      </div>

      {/* Tab-style Filter */}
      <div className="flex flex-wrap gap-2">
        {/* All Regions */}
        <button
          onClick={() => handleRegionSelect('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            !currentRegion
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          All Regions
        </button>

        {/* Individual Regions */}
        {regions.map((region) => {
          const isSelected = currentRegion === region;
          const displayName = formatRegionName(region);

          return (
            <button
              key={region}
              onClick={() => handleRegionSelect(region)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {displayName}
              {region === 'SEOUL' && (
                <span className={`ml-1.5 text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                  (Gangnam + Gangbuk)
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
