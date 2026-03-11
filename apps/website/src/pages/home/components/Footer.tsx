export default function Footer() {
  return (
    <footer id="contact" className="bg-[#1E1E1E] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center mb-6">
              <a href="#" aria-label="Go to top">
                <img
                  src="/saflogo.png"
                  alt="SAF Institute"
                  className="h-24 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity drop-shadow-md"
                />
              </a>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Ghana's premier German language institute, helping students achieve their dreams of studying, working, and living in Germany.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0F6B3E] flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0F6B3E] flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0F6B3E] flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <i className="ri-linkedin-fill text-lg"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0F6B3E] flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <i className="ri-twitter-x-line text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-['Poppins'] text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#courses" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  Our Courses
                </a>
              </li>
              <li>
                <a href="#why-saf" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  Why SAF Institute
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  Student Success Stories
                </a>
              </li>
              <li>
                <a href="#visa" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  Visa Consultation
                </a>
              </li>
              <li>
                <a href="#locations" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  Our Locations
                </a>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-['Poppins'] text-lg font-bold mb-6">Courses</h3>
            <ul className="space-y-3">
              <li>
                <a href="#courses" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  A1 Beginner
                </a>
              </li>
              <li>
                <a href="#courses" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  A2 Elementary
                </a>
              </li>
              <li>
                <a href="#courses" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  B1 Intermediate
                </a>
              </li>
              <li>
                <a href="#courses" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  B2 Advanced
                </a>
              </li>
              <li>
                <a href="#courses" className="text-white/70 hover:text-[#C7F000] transition-colors duration-200 whitespace-nowrap">
                  Private Lessons
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-['Poppins'] text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="ri-map-pin-line text-[#C7F000] text-xl flex-shrink-0"></i>
                <div>
                  <div className="font-semibold mb-1">Accra</div>
                  <div className="text-white/70 text-sm">Darkuman Circle Station, Accra</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-map-pin-line text-[#C7F000] text-xl flex-shrink-0"></i>
                <div>
                  <div className="font-semibold mb-1">Kumasi</div>
                  <div className="text-white/70 text-sm">Behind Tech Police Station, Kumasi</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-phone-line text-[#C7F000] text-xl flex-shrink-0"></i>
                <a href="tel:+233244506301" className="text-white/70 hover:text-[#C7F000] transition-colors whitespace-nowrap">
                  +233 24 450 6301
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-mail-line text-[#C7F000] text-xl flex-shrink-0"></i>
                <a href="mailto:info@safinstitute.com" className="text-white/70 hover:text-[#C7F000] transition-colors whitespace-nowrap">
                  info@safinstitute.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2025 SAF Institute. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/60 hover:text-[#C7F000] text-sm transition-colors whitespace-nowrap">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-[#C7F000] text-sm transition-colors whitespace-nowrap">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-[#C7F000] text-sm transition-colors whitespace-nowrap">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
