import { Mail } from 'lucide-react';

// logos
import firstImage from '../../assets/first-image.png';
import secondImage from '../../assets/second-image.jpeg';
import thirdImage from '../../assets/third-image.png';
import fourthImage from '../../assets/fourth-image.png';

const logos = [
  firstImage,
  secondImage,
  thirdImage,
  fourthImage,
];

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: 'var(--blue)',
        color: '#fff',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-16 md:py-20">
        
        {/* Left */}
        <div>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: '#fff',
              marginBottom: '1.5rem',
            }}
          >
            Law,<br />
            Liberty &amp;<br />
            Civic<br />
            Responsibility
          </h2>

          <p
            style={{
              fontFamily:
                "'Cormorant Garamond', Georgia, serif",
              fontSize: '0.88rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 340,
            }}
          >
            An independent civic initiative strengthening
            rule-of-law awareness and democratic
            participation across Sri Lanka.
          </p>

          <div
            className="mt-6 pt-6"
            style={{
              borderTop:
                '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <span
              style={{
                fontFamily:
                  "'IBM Plex Mono', monospace",
                fontSize: '0.48rem',
                letterSpacing: '0.16em',
                color:
                  'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
              }}
            >
              SUSI Rule of Law Alumni · Sri Lanka · 2026
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-between">
          <div>
            <span
              className="block mb-6"
              style={{
                fontFamily:
                  "'IBM Plex Mono', monospace",
                fontSize: '0.52rem',
                letterSpacing: '0.2em',
                color:
                  'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
              }}
            >
              Contact
            </span>

            <a
              href="mailto:civiclawinitiative@gmail.com"
              className="inline-flex items-center gap-3 group no-underline"
            >
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--red)] transition-colors duration-200"
                style={{
                  background:
                    'rgba(255,255,255,0.1)',
                  border:
                    '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <Mail size={16} color="#fff" />
              </div>

              <span
                style={{
                  fontFamily:
                    "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.05rem',
                  color: '#fff',
                }}
              >
                civiclawinitiative@gmail.com
              </span>
            </a>

            {/* Logos */}
<div className="mt-10">
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
    {logos.map((logo, index) => (
      <div
        key={index}
        className="
          h-[80px]
          md:h-[92px]
          rounded-sm
          flex
          items-center
          justify-center
          p-3
          transition-all
          duration-300
          hover:scale-105
        "
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <img
          src={logo}
          alt={`logo-${index}`}
          className="
            max-h-full
            max-w-full
            object-contain
          "
        />
      </div>
    ))}
  </div>
</div>
          </div>

          <div
            className="mt-12 pt-6"
            style={{
              borderTop:
                '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <span
              style={{
                fontFamily:
                  "'IBM Plex Mono', monospace",
                fontSize: '0.44rem',
                letterSpacing: '0.14em',
                color:
                  'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                lineHeight: 1.8,
                display: 'block',
              }}
            >
              Civic Law Initiative · Independent ·
              Non-partisan · Non-governmental
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}