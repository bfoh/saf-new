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
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLinkClick = () => setMobileOpen(false);

  const isLight = scrolled || mobileOpen;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLight ? 'bg-white shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center" aria-label="Go to top">
              <img
                src="/saflogo.png"
                alt="SAF Institute"
                className={`h-20 w-auto object-contain transition-all duration-300 drop-shadow-md ${isLight ? '' : 'brightness-0 invert'
                  }`}
              />
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#1E1E1E] hover:text-[#0F6B3E] transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                className="bg-[#0F6B3E] text-white px-6 py-2.5 rounded-full hover:bg-[#0d5a33] transition-all duration-200 font-medium whitespace-nowrap shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#1E1E1E] hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <i className={`text-2xl transition-transform duration-200 ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 left-0 right-0 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
          {/* Menu Header (mirrors navbar height) */}
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 border-b border-gray-100">
            <a href="#" onClick={handleLinkClick} aria-label="Go to top">
              <img
                src="/saflogo.png"
                alt="SAF Institute"
                className="h-20 w-auto object-contain drop-shadow-md"
              />
            </a>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg text-[#1E1E1E] hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Links */}
          <nav className="px-4 sm:px-6 py-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#1E1E1E] font-medium text-base hover:bg-[#F6F9F3] hover:text-[#0F6B3E] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4">
              <a
                href="#contact"
                onClick={handleLinkClick}
                className="flex items-center justify-center bg-[#0F6B3E] text-white px-6 py-4 rounded-xl font-semibold text-base hover:bg-[#0d5a33] transition-all duration-200 shadow-lg"
              >
                Get Started — Free Consultation
              </a>
            </div>
          </nav>

          {/* Footer info */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex items-center gap-3 text-sm text-[#1E1E1E]/50">
            <i className="ri-phone-line text-[#0F6B3E]"></i>
            <a href="tel:+233244506301" className="hover:text-[#0F6B3E] transition-colors">+233 24 450 6301</a>
          </div>
        </div>
      </div>
    </>
  );
}
