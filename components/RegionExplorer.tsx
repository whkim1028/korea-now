"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegionSearchBar from "./RegionSearchBar";
import Link from "next/link";

interface RegionExplorerProps {
  regions: string[];
}

export default function RegionExplorer({ regions }: RegionExplorerProps) {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState("");

  const handleExplore = () => {
    if (selectedRegion) {
      router.push(`/restaurants?region=${selectedRegion}`);
    } else {
      router.push("/restaurants");
    }
  };

  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
        Where Are Koreans Eating Right Now?
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
        Search by area to see what locals are actually into.{" "}
      </p>

      {/* Search Bar */}
      <div className="mb-8">
        <RegionSearchBar regions={regions} onRegionSelect={setSelectedRegion} />
      </div>

      {/* Selected Region Indicator */}
      {selectedRegion && (
        <div className="mb-6 flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Selected:{" "}
            <span className="text-gray-900 font-semibold">
              {selectedRegion.charAt(0) + selectedRegion.slice(1).toLowerCase()}
            </span>
          </span>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleExplore}
          className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-105"
        >
          <span>
            {selectedRegion
              ? `Explore ${
                  selectedRegion.charAt(0) +
                  selectedRegion.slice(1).toLowerCase()
                }`
              : "Explore Local Picks"}
          </span>
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
        <Link
          href="/restaurants?region=SEOUL"
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
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
          <span>Explore Seoul</span>
        </Link>
      </div>
    </div>
  );
}
