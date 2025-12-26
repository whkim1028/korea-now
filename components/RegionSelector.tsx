'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const REGIONS = [
  { nameKo: '서울', nameEn: 'SEOUL' },
  { nameKo: '부산', nameEn: 'BUSAN' },
  { nameKo: '대구', nameEn: 'DAEGU' },
  { nameKo: '인천', nameEn: 'INCHEON' },
  { nameKo: '광주', nameEn: 'GWANGJU' },
  { nameKo: '대전', nameEn: 'DAEJEON' },
  { nameKo: '울산', nameEn: 'ULSAN' },
  { nameKo: '세종', nameEn: 'SEJONG' },
  { nameKo: '강원도', nameEn: 'GANGWON' },
  { nameKo: '경기도', nameEn: 'GYEONGGI' },
  { nameKo: '충청북도', nameEn: 'CHUNGBUK' },
  { nameKo: '충청남도', nameEn: 'CHUNGNAM' },
  { nameKo: '전라북도', nameEn: 'JEONBUK' },
  { nameKo: '전라남도', nameEn: 'JEONNAM' },
  { nameKo: '경상북도', nameEn: 'GYEONGBUK' },
  { nameKo: '경상남도', nameEn: 'GYEONGNAM' },
  { nameKo: '제주도', nameEn: 'JEJU' },
];

export default function RegionSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  useEffect(() => {
    const region = searchParams.get('region') || '';
    setSelectedRegion(region);
  }, [searchParams]);

  const handleRegionClick = (regionEn: string) => {
    // Update URL with region parameter
    const params = new URLSearchParams(searchParams);
    if (regionEn) {
      params.set('region', regionEn);
    } else {
      params.delete('region');
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/', { scroll: false });

    setSelectedRegion(regionEn);

    // Scroll to Trending Restaurants section
    setTimeout(() => {
      const restaurantsSection = document.getElementById('trending-restaurants');
      if (restaurantsSection) {
        restaurantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-serif font-semibold text-white mb-8 text-center md:text-left">
          어느 지역의 로컬 음식을 찾으세요?
        </h2>

        <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
          {REGIONS.map((region) => {
            const isSelected = selectedRegion === region.nameEn;
            return (
              <button
                key={region.nameEn}
                onClick={() => handleRegionClick(region.nameEn)}
                className={`px-5 py-2.5 rounded-md text-sm md:text-base font-medium transition-all duration-300 ease-in-out ${
                  isSelected
                    ? 'bg-white text-gray-900 font-bold shadow-lg'
                    : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-900'
                }`}
              >
                {region.nameKo}
              </button>
            );
          })}

          {/* All Regions Button */}
          <button
            onClick={() => handleRegionClick('')}
            className={`px-6 py-2.5 rounded-md text-sm md:text-base font-semibold transition-all duration-300 ease-in-out w-full md:w-auto mt-2 md:mt-0 ${
              !selectedRegion
                ? 'bg-white text-gray-900 font-bold shadow-lg'
                : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-900'
            }`}
          >
            모든 지역 보기 &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
