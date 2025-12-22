export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">KoreaNow</h3>
            <p className="text-sm text-gray-600">
              Discover what&apos;s trending in Korea.
              Real local insights for global audiences.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <a href="/editorials" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Editorial
                </a>
              </li>
              <li>
                <a href="/restaurants" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Restaurants
                </a>
              </li>
              <li>
                <a href="/glossary" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Glossary
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              We curate Korean local trends and translate them for global audiences.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} KoreaNow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
