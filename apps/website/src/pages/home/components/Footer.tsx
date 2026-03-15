export default function Footer() {
  const quickLinks = [
    { href: '#courses', label: 'Our Courses' },
    { href: '#why-saf', label: 'Why SAF Institute' },
    { href: '#testimonials', label: 'Student Stories' },
    { href: '#visa', label: 'Visa Consultation' },
    { href: '#locations', label: 'Our Locations' },
  ];

  const courseLinks = [
    'A1 Beginner',
    'A2 Elementary',
    'B1 Intermediate',
    'B2 Advanced',
    'Private Lessons',
  ];

  const socialLinks = [
    { icon: 'ri-facebook-fill', href: '#', label: 'Facebook' },
    { icon: 'ri-instagram-line', href: '#', label: 'Instagram' },
    { icon: 'ri-youtube-line', href: '#', label: 'YouTube' },
    { icon: 'ri-twitter-x-line', href: '#', label: 'X / Twitter' },
  ];

  return (
    <footer id="contact" className="bg-[#111] text-white overflow-hidden">
      {/* Top CTA strip */}
      <div className="bg-gradient-to-r from-[#0F6B3E] via-[#1a8a50] to-[#4CAF50] relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid-white pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-['Poppins'] text-2xl font-bold text-white mb-1">
                Ready to speak German?
              </h3>
              <p className="text-white/80 text-sm">Book a free consultation — our advisors will help you get started today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#C7F000] text-[#0F6B3E] px-7 py-3 rounded-full font-extrabold text-sm hover:bg-white transition-all duration-200 shadow-xl hover:scale-105 whitespace-nowrap"
              >
                <i className="ri-calendar-check-line text-base"></i>
                Book Free Consultation
              </a>
              <a
                href="https://wa.me/233244506301?text=Hello%2C%20I%27m%20interested%20in%20learning%20German."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-white/25 transition-all duration-200 whitespace-nowrap"
              >
                <i className="ri-whatsapp-line text-base"></i>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="#" aria-label="Go to top" className="inline-block mb-5 hover:opacity-80 transition-opacity">
              <img
                src="/saflogo.png"
                alt="SAF Institute"
                className="h-20 w-auto object-contain brightness-0 invert drop-shadow-md"
              />
            </a>
            <p className="text-white/60 leading-relaxed text-sm mb-6">
              Ghana's premier German language institute — preparing students for study, work, and life in Germany since 2014.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group w-10 h-10 rounded-xl bg-white/8 hover:bg-[#0F6B3E] flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <i className={`${s.icon} text-base text-white/70 group-hover:text-white transition-colors`}></i>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="mt-5 flex items-center gap-2 text-xs text-white/40">
              <i className="ri-time-line text-[#C7F000]"></i>
              <span>Mon–Sat · 8:00 AM – 6:00 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-['Poppins'] text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group flex items-center gap-2 text-white/65 hover:text-[#C7F000] transition-colors duration-200 text-sm"
                  >
                    <i className="ri-arrow-right-s-line text-[#0F6B3E] group-hover:translate-x-1 transition-transform duration-200"></i>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-['Poppins'] text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Courses</h3>
            <ul className="space-y-2.5">
              {courseLinks.map((c) => (
                <li key={c}>
                  <a
                    href="#courses"
                    className="group flex items-center gap-2 text-white/65 hover:text-[#C7F000] transition-colors duration-200 text-sm"
                  >
                    <i className="ri-arrow-right-s-line text-[#0F6B3E] group-hover:translate-x-1 transition-transform duration-200"></i>
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-['Poppins'] text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F6B3E]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-map-pin-line text-[#C7F000] text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold text-white/80 mb-0.5">Accra Campus</div>
                  <div className="text-white/55 text-xs">Darkuman Circle Station, Accra</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F6B3E]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-map-pin-line text-[#C7F000] text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold text-white/80 mb-0.5">Kumasi Campus</div>
                  <div className="text-white/55 text-xs">Behind Tech Police Station, Kumasi</div>
                </div>
              </li>
              <li>
                <a
                  href="tel:+233244506301"
                  className="flex items-center gap-3 group hover:text-[#C7F000] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0F6B3E]/30 flex items-center justify-center flex-shrink-0">
                    <i className="ri-phone-line text-[#C7F000] text-sm"></i>
                  </div>
                  <span className="text-white/65 text-sm group-hover:text-[#C7F000] transition-colors whitespace-nowrap">
                    +233 24 450 6301
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@safinstitute.com"
                  className="flex items-center gap-3 group hover:text-[#C7F000] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0F6B3E]/30 flex items-center justify-center flex-shrink-0">
                    <i className="ri-mail-line text-[#C7F000] text-sm"></i>
                  </div>
                  <span className="text-white/65 text-sm group-hover:text-[#C7F000] transition-colors">
                    info@safinstitute.com
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/35 text-xs">
              © {new Date().getFullYear()} SAF Institute Ghana. All rights reserved.
            </p>
            <div className="flex gap-5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-white/35 hover:text-[#C7F000] text-xs transition-colors whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
