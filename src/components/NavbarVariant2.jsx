import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const TEAL = {
  primary: '#062926',
  accent:  '#2AB5A5',
  bg:      'rgba(255,255,255,0.80)',
  border:  'rgba(180,230,225,0.60)',
  muted:   '#527B78',
};

export default function NavbarVariant2() {
  const [isOpen, setIsOpen]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const location                  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { path: '/',         label: 'Home' },
    { path: '/about',    label: 'About' },
    { path: '/research', label: 'Our Discovery' },
    { path: '/services', label: 'Services' },
    { path: '/blogs',    label: 'Events & Blog' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(42,181,165,0.35); }
          50%       { box-shadow: 0 0 28px rgba(42,181,165,0.55); }
        }

        .nav-teal-glass {
          background: ${scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.70)'};
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid ${TEAL.border};
          transition: background 0.35s ease, box-shadow 0.35s ease;
          ${scrolled ? 'box-shadow: 0 4px 24px rgba(6,41,38,0.08);' : ''}
        }

        .nav-link-teal {
          position: relative;
          color: ${TEAL.muted};
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: color 0.25s ease;
        }

        .nav-link-teal::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: ${TEAL.accent};
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link-teal.active,
        .nav-link-teal:hover {
          color: ${TEAL.primary};
        }

        .nav-link-teal.active::after,
        .nav-link-teal:hover::after {
          width: 100%;
        }

        .nav-cta {
          background: ${TEAL.accent};
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 22px;
          border-radius: 8px;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
          animation: glowPulse 3.5s ease-in-out infinite;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .nav-cta:hover {
          background: #1D9A8C;
          transform: scale(1.03);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-menu-teal {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
          border-top: 1px solid ${TEAL.border};
          animation: slideDown 0.25s ease;
        }
      `}</style>

      {/* Desktop */}
      <nav className="hidden md:block fixed top-0 w-full z-50 nav-teal-glass">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <img
              src="/images/logo.svg"
              alt="ALLC - Asian Longevity & Lifestyle Clinic"
              className="h-9 lg:h-10 w-auto transition-opacity group-hover:opacity-85"
            />
          </Link>

          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link-teal ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link to="/contact" className="nav-cta">
            <span>Apply Now</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Mobile */}
      <nav className="md:hidden fixed top-0 w-full z-50 nav-teal-glass">
        <div className="px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.svg"
              alt="ALLC - Asian Longevity & Lifestyle Clinic"
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="transition-all duration-200"
            style={{ color: TEAL.primary }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="mobile-menu-teal absolute top-full left-0 w-full">
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`nav-link-teal ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="nav-cta justify-center"
              >
                <span>Apply Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
