import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-serif font-bold text-gray-900 hover:text-gray-700 transition-colors">
            KoreaNow
          </Link>

          <nav className="flex space-x-8">
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
        </div>
      </div>
    </header>
  );
}
