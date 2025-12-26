import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://koreanow.app'),
  title: {
    default: "KoreaNow - What Koreans Are Really Eating — Right Now",
    template: '%s | KoreaNow',
  },
  description: "Discover authentic Korean regional food and local restaurants. From K-food to Culinary Class Wars, find what Koreans really eat by region.",
  keywords: [
    'K-food',
    'Korean regional food',
    'Korean local food guide',
    'What Koreans really eat',
    'Korean food by region',
    'Local Korean restaurants',
    'Korean food on Netflix',
    'Korean cooking show food',
    'Foods seen on Korean TV shows',
    'Korean food from Netflix shows',
    'Culinary Class Wars',
    'Culinary Class Wars Netflix',
    'Foods from Culinary Class Wars',
    'Black White Chef',
    'Korean food culture',
    'Korean restaurants by region',
    'Authentic Korean food',
    'Korean street food',
    'Traditional Korean cuisine',
    'Korean food trends',
  ],
  authors: [{ name: 'KoreaNow' }],
  creator: 'KoreaNow',
  publisher: 'KoreaNow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://koreanow.app',
    siteName: 'KoreaNow',
    title: 'KoreaNow - What Koreans Are Really Eating — Right Now',
    description: 'Discover authentic Korean regional food and local restaurants. From K-food to Culinary Class Wars, find what Koreans really eat by region.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'KoreaNow - What Koreans Are Really Eating',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KoreaNow - What Koreans Are Really Eating — Right Now',
    description: 'Discover authentic Korean regional food and local restaurants. From K-food to Culinary Class Wars.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console 등록 후 verification code 추가 예정
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WH9WVHZW');`}
        </Script>
      </head>
      <body className="font-sans antialiased bg-white text-gray-900 flex flex-col min-h-screen">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WH9WVHZW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Structured Data - Organization & WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://koreanow.app/#organization',
                  name: 'KoreaNow',
                  url: 'https://koreanow.app',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://koreanow.app/opengraph-image',
                  },
                  description: 'Authentic Korean regional food and local restaurant guide',
                  sameAs: [],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://koreanow.app/#website',
                  url: 'https://koreanow.app',
                  name: 'KoreaNow',
                  description: 'What Koreans Are Really Eating — Right Now',
                  publisher: {
                    '@id': 'https://koreanow.app/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://koreanow.app/restaurants?region={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />

        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
