import React from 'react';
import KYCVerifier from './KYCVerifier';

interface ThemeColors {
  background: string;
  cardBg: string;
  primary: string;
  primaryHover: string;
  textPrimary: string;
  textSecondary: string;
  shadow: string;
  link: string;
  linkHover: string;
}

const darkThemeColors: ThemeColors = {
  background: '#121217',
  cardBg: 'rgba(25, 27, 31, 0.95)',
  primary: '#4c55d2',
  primaryHover: '#616df5',
  textPrimary: '#e0e0e0',
  textSecondary: '#9a9db3',
  shadow: 'rgba(0, 0, 0, 0.7)',
  link: '#62dafb',
  linkHover: '#39ffbe',
};

const KYC: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: darkThemeColors.background,
        color: darkThemeColors.textPrimary,
        fontFamily: "'Inter', Arial, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          backgroundColor: darkThemeColors.cardBg,
          boxShadow: `0 12px 36px ${darkThemeColors.shadow}`,
          borderRadius: '1rem',
          width: '90vw',
          maxWidth: 720,
          height: '90vh',
          padding: '2rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: '0.25rem',
            }}
          >
            🇮🇳 Aadhaar ZK KYC Verification
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '1.5rem' }}>
            Zero-Knowledge Proof based KYC verification system
          </p>
        </header>

        <main
          style={{
            width: '100%',
            flexGrow: 1,
          }}
        >
          <KYCVerifier />
        </main>

        <footer
          style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            fontSize: '0.9rem',
            color: darkThemeColors.textSecondary,
          }}
        >
          <p>Built with ❤️ using StealthSDK & Polygon</p>
          <div
            style={{
              marginTop: '0.6rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1.2rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { href: 'https://polygon.technology/developers', label: 'Polygon Docs' },
              { href: 'https://amoy.polygonscan.com/', label: 'Amoy Explorer' },
              { href: 'https://github.com/arpitSatpute/StealthSDK', label: 'StealthSDK' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: darkThemeColors.link,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = darkThemeColors.linkHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = darkThemeColors.link)
                }
              >
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default KYC;