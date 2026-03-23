import React from 'react';
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const T = {
  primary:    '#062926',
  accent:     '#2AB5A5',
  accentHov:  '#1D9A8C',
  bg:         '#DCF4F1',
  surface:    '#FFFFFF',
  border:     '#C4E8E4',
  heading:    '#062926',
  body:       '#1C3835',
  muted:      '#527B78',
  onAccent:   '#FFFFFF',
};

export default function FooterVariant2() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'Home',         path: '/' },
      { label: 'About',        path: '/about' },
      { label: 'Our Discovery',path: '/research' },
      { label: 'Services',     path: '/services' },
      { label: 'Contact',      path: '/contact' },
    ],
    contact: [
      { label: 'Phone',   value: '+91 96806 77781', icon: Phone },
      { label: 'Email',   value: 'contact@asianllc.com',  icon: Mail },
      { label: 'Address', value: 'India',   icon: MapPin },
    ],
  };

  return (
    <>
      <style>{`
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .footer-teal-card {
          background: ${T.surface};
          border: 1px solid ${T.border};
          border-radius: 16px;
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: cardEnter 0.5s ease both;
          box-shadow: 0 2px 12px rgba(6,41,38,0.04);
        }

        .footer-teal-card:hover {
          transform: translateY(-3px);
          border-color: rgba(42,181,165,0.45);
          box-shadow: 0 8px 32px rgba(42,181,165,0.12);
        }

        .footer-teal-card h3 {
          font-size: 17px;
          font-weight: 700;
          color: ${T.heading};
          margin-bottom: 16px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          letter-spacing: -0.01em;
        }

        .footer-teal-link {
          position: relative;
          color: ${T.muted};
          font-size: 14px;
          transition: color 0.25s ease;
          display: inline-block;
        }

        .footer-teal-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: ${T.accent};
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-teal-link:hover { color: ${T.accent}; }
        .footer-teal-link:hover::after { width: 100%; }

        .newsletter-input-teal {
          background: ${T.bg};
          border: 1px solid ${T.border};
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 14px;
          color: ${T.body};
          width: 100%;
          transition: all 0.25s ease;
        }

        .newsletter-input-teal::placeholder { color: ${T.muted}; }

        .newsletter-input-teal:focus {
          outline: none;
          border-color: ${T.accent};
          box-shadow: 0 0 0 3px rgba(42,181,165,0.18);
        }

        .newsletter-btn-teal {
          background: ${T.accent};
          border: none;
          color: ${T.onAccent};
          font-weight: 600;
          padding: 11px 20px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          width: 100%;
        }

        .newsletter-btn-teal:hover {
          background: ${T.accentHov};
          transform: scale(1.02);
        }

        .mobile-nav-teal {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(14px);
          border-top: 1px solid ${T.border};
        }
      `}</style>

      <footer style={{ backgroundColor: T.bg, borderTop: `1px solid ${T.border}` }} className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Brand */}
            <div className="footer-teal-card" style={{ animationDelay: '0ms' }}>
              <div className="mb-4">
                <img
                  src="/images/logo.svg"
                  alt="ALLC - Asian Longevity & Lifestyle Clinic"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                Precision lifestyle medicine for sovereign, lasting health — built on evidence, delivered with care.
              </p>
              {/* Social links — YouTube placeholder until channel is live */}
              <div className="flex gap-4 mt-5">
                <a href="https://www.instagram.com/asianllc?igsh=NXU5cGYwczVnd2Vl" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-teal-link">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61582477469664" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-teal-link">
                  <Facebook size={20} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube (coming soon)" className="footer-teal-link">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Nav links */}
            <div className="footer-teal-card" style={{ animationDelay: '80ms' }}>
              <h3>Navigation</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-teal-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div className="footer-teal-card" style={{ animationDelay: '160ms' }}>
              <h3>Contact</h3>
              <ul className="space-y-4">
                {footerLinks.contact.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-start gap-3">
                      <Icon size={17} style={{ color: T.accent }} className="mt-0.5 flex-shrink-0" />
                      <a
                        href={item.label === 'Email' ? `mailto:${item.value}` : '#'}
                        className="footer-teal-link text-sm"
                      >
                        {item.value}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-teal-card" style={{ animationDelay: '240ms' }}>
              <h3>Longevity Digest</h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: T.muted }}>
                Stay updated with insights on precision health.
              </p>
              <form className="flex flex-col gap-3">
                <input type="email" placeholder="Your email" className="newsletter-input-teal" />
                <button type="submit" className="newsletter-btn-teal">Subscribe →</button>
              </form>
            </div>

          </div>
        </div>

        <div style={{ borderTop: `1px solid ${T.border}` }} />

        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: T.muted }}>© {currentYear} ALLC Clinic. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="#" className="footer-teal-link text-xs">Privacy Policy</Link>
            <Link to="#" className="footer-teal-link text-xs">Terms of Service</Link>
          </div>
        </div>

        {/* Fixed bottom nav on mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 mobile-nav-teal z-40">
          <div className="flex items-center justify-around">
            {[
              { path: '/', label: 'Home',     icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
              { path: '/about',    label: 'About',    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { path: '/services', label: 'Services', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
              { path: '/contact',  label: 'Contact',  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
            ].map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className="flex-1 flex flex-col items-center justify-center py-3 transition-colors"
                style={{ color: T.muted }}
              >
                <span style={{ color: window.location?.pathname === path ? T.accent : T.muted }}>{icon}</span>
                <span className="text-[10px] font-medium mt-0.5">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Spacer so content isn't hidden behind fixed mobile nav */}
        <div className="md:hidden h-20" />
      </footer>
    </>
  );
}
