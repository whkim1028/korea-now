'use client';

import { useState, useRef, useEffect } from 'react';

interface RegionSearchBarProps {
  regions: string[];
  onRegionSelect?: (region: string) => void;
}

export default function RegionSearchBar({ regions, onRegionSelect }: RegionSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatRegionName = (region: string) => {
    return region.charAt(0) + region.slice(1).toLowerCase();
  };

  // Filter regions based on search term
  const filteredRegions = regions.filter((region) =>
    region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSearchTerm(formatRegionName(region));
    setIsOpen(false);
    if (onRegionSelect) {
      onRegionSelect(region);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredRegions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredRegions[selectedIndex]) {
          handleRegionSelect(filteredRegions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a region... (e.g., Seoul, Busan, Jeju)"
          className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-lg"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('');
              setIsOpen(false);
              inputRef.current?.focus();
              if (onRegionSelect) {
                onRegionSelect('');
              }
            }}
            className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && searchTerm && filteredRegions.length > 0 && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Results */}
          <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-80 overflow-y-auto">
            <div className="py-2">
              {filteredRegions.map((region, index) => {
                const displayName = formatRegionName(region);
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className={`w-full text-left px-6 py-3 transition-colors ${
                      isSelected
                        ? 'bg-gray-900 text-white'
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium">{displayName}</span>
                      {region === 'SEOUL' && (
                        <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                          (Gangnam + Gangbuk)
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* No Results */}
      {isOpen && searchTerm && filteredRegions.length === 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 text-center">
            <p className="text-gray-500">No regions found matching "{searchTerm}"</p>
          </div>
        </>
      )}
    </div>
  );
}
