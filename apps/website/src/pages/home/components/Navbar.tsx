import { useState, useEffect } from 'react';

interface NavbarProps {
  scrolled: boolean;
}

const navLinks = [
  { href: '#courses', label: 'Courses' },
  { href: '#why-saf', label: 'Why SAF' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#visa', label: 'Visa Support' },
  { href: '#locations', label: 'Locations' },
];

export default function Navbar({ scrolled }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  // Close menu on resize back to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Track active section
  useEffect(() => {
    const onScroll = () => {
      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveHash(`#${id}`);
          return;
        }
      }
      setActiveHash('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = () => setMobileOpen(false);
  const isLight = scrolled || mobileOpen;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isLight
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center group" aria-label="Go to top">
              <img
                src="/saflogo.png"
                alt="SAF Institute"
                className={`h-16 w-auto object-contain transition-all duration-500 drop-shadow-md ${
                  isLight ? '' : 'brightness-0 invert'
                } group-hover:scale-105`}
              />
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isLight ? 'text-[#1E1E1E]' : 'text-white'
                  } hover:text-[#0F6B3E] group`}
                >
                  {link.label}
                  {/* Active/hover underline */}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#0F6B3E] transition-all duration-300 ${
                      activeHash === link.href
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'
                    }`}
                  ></span>
                </a>
              ))}
              <a
                href="#contact"
                className="ml-4 relative overflow-hidden bg-[#0F6B3E] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#0d5a33] transition-all duration-300 shadow-lg hover:shadow-[#0F6B3E]/40 hover:scale-105 whitespace-nowrap inline-flex items-center gap-2"
              >
                <i className="ri-calendar-check-line"></i>
                Get Started
                <span className="absolute inset-0 animate-shimmer rounded-full pointer-events-none opacity-0 hover:opacity-100"></span>
              </a>
            </div>

            {/* Hamburger */}
            <button
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                isLight
                  ? 'text-[#1E1E1E] hover:bg-gray-100'
                  : 'text-white hover:bg-white/15'
              }`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                <span
                  className={`absolute w-5 h-0.5 rounded-full transition-all duration-300 ${isLight ? 'bg-[#1E1E1E]' : 'bg-white'} ${
                    mobileOpen ? 'rotate-45' : '-translate-y-1.5'
                  }`}
                ></span>
                <span
                  className={`absolute w-5 h-0.5 rounded-full transition-all duration-300 ${isLight ? 'bg-[#1E1E1E]' : 'bg-white'} ${
                    mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`absolute w-5 h-0.5 rounded-full transition-all duration-300 ${isLight ? 'bg-[#1E1E1E]' : 'bg-white'} ${
                    mobileOpen ? '-rotate-45' : 'translate-y-1.5'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu Panel — slides down */}
        <div
          className={`absolute top-0 left-0 right-0 bg-white shadow-2xl transition-transform duration-400 ease-out ${
            mobileOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-20 px-5 border-b border-gray-100">
            <a href="#" onClick={handleLinkClick} aria-label="Go to top">
              <img src="/saflogo.png" alt="SAF Institute" className="h-16 w-auto object-contain" />
            </a>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-xl text-[#1E1E1E] hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Links */}
          <nav className="px-5 py-5 space-y-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 ${
                  activeHash === link.href
                    ? 'bg-[#0F6B3E]/10 text-[#0F6B3E]'
                    : 'text-[#1E1E1E] hover:bg-[#F6F9F3] hover:text-[#0F6B3E]'
                }`}
                style={{ transitionDelay: `${i * 35}ms` }}
              >
                {activeHash === link.href && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B3E] flex-shrink-0"></span>
                )}
                {link.label}
              </a>
            ))}
            <div className="pt-3">
              <a
                href="#contact"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0F6B3E] to-[#4CAF50] text-white px-6 py-4 rounded-2xl font-bold text-base shadow-lg hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
              >
                <i className="ri-calendar-check-line text-lg"></i>
                Get Started — Free Consultation
              </a>
            </div>
          </nav>

          {/* Footer info */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-[#1E1E1E]/50">
            <div className="flex items-center gap-2">
              <i className="ri-phone-line text-[#0F6B3E]"></i>
              <a href="tel:+233244506301" className="hover:text-[#0F6B3E] transition-colors font-medium">
                +233 24 450 6301
              </a>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-map-pin-line text-[#0F6B3E]"></i>
              <span>Accra · Kumasi</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
