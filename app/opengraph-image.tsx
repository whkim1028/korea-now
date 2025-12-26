import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'KoreaNow - What Koreans Are Really Eating';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111827',
          backgroundImage: 'linear-gradient(to bottom right, #111827, #1f2937)',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          {/* Logo/Brand Name */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              background: 'linear-gradient(to right, #ffffff, #e5e7eb)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.05em',
              marginBottom: '40px',
            }}
          >
            KoreaNow
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 48,
              color: '#9ca3af',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.3,
              fontWeight: 500,
            }}
          >
            What Koreans Are Really Eating — Right Now
          </div>

          {/* Accent Bar */}
          <div
            style={{
              width: '200px',
              height: '4px',
              background: 'linear-gradient(to right, #ffffff, #6b7280)',
              marginTop: '60px',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Footer Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 28px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            🇰🇷 K-Food Guide
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
