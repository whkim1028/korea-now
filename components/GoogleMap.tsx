'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

export default function GoogleMap({ lat, lng, name, address }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script is already loaded
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          setScriptLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || mapLoaded) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 16,
      // Disable most controls for minimal UI
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      // Prevent scroll hijacking on mobile - require ctrl/cmd to zoom
      gestureHandling: 'cooperative',
    });

    // Add marker
    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: name,
    });

    setMapLoaded(true);
  }, [scriptLoaded, lat, lng, name, mapLoaded]);

  // Generate Google Maps URL
  const getGoogleMapsUrl = () => {
    // For mobile, use geo: URI that opens native app
    // For desktop, use web URL
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Opens in Google Maps app if installed
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else {
      // Opens in browser
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
  };

  const handleOpenInMaps = () => {
    window.open(getGoogleMapsUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden bg-gray-100"
        style={{ minHeight: '200px' }}
      >
        {!scriptLoaded && (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Loading map...
          </div>
        )}
      </div>

      {/* Open in Google Maps Button */}
      <button
        onClick={handleOpenInMaps}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 min-h-[44px]"
        aria-label="Open location in Google Maps"
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
        Open in Google Maps
      </button>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}
