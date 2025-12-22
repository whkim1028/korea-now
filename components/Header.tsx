'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-serif font-bold text-gray-900 hover:text-gray-700 transition-colors"
              onClick={closeMobileMenu}
            >
              KoreaNow
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/restaurants" className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                Restaurants
              </Link>
              <Link href="/editorials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Editorial
              </Link>
              <Link href="/glossary" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Glossary
              </Link>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                // X icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 md:hidden animate-slideDown">
            <nav className="px-4 py-6 space-y-4">
              <Link
                href="/restaurants"
                className="block text-lg font-semibold text-gray-900 hover:text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Restaurants
              </Link>
              <Link
                href="/editorials"
                className="block text-lg font-medium text-gray-600 hover:text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Editorial
              </Link>
              <Link
                href="/glossary"
                className="block text-lg font-medium text-gray-600 hover:text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Glossary
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
