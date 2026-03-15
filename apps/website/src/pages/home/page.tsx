import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Courses from './components/Courses';
import PricingTable from './components/PricingTable';
import LearningExperience from './components/LearningExperience';
import Testimonials from './components/Testimonials';
import VisaConsultation from './components/VisaConsultation';
import ConsultationForm from './components/ConsultationForm';
import FAQ from './components/FAQ';
import Locations from './components/Locations';
import WhySAF from './components/WhySAF';
import Opportunity from './components/Opportunity';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowFloatingBtn(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookConsultation = () => {
    const section = document.getElementById('consultation-form');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#F6F9F3] overflow-hidden">
      <Navbar scrolled={scrolled} />
      <Hero />
      <Courses />
      <PricingTable />
      <LearningExperience />
      <Testimonials />
      <VisaConsultation />
      <ConsultationForm />
      <FAQ />
      <Locations />
      <WhySAF />
      <Opportunity />
      <Footer />

      {/* Floating action buttons — bottom right */}
      <div
        className={`fixed bottom-5 right-3 sm:bottom-8 sm:right-6 z-50 flex flex-col items-end gap-2.5 transition-all duration-500 ${
          showFloatingBtn
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 hover:border-[#0F6B3E]/30 transition-all duration-200 cursor-pointer"
          aria-label="Back to top"
        >
          <i className="ri-arrow-up-line text-[#0F6B3E] text-base"></i>
        </button>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/233244506301?text=Hello%2C%20I%27m%20interested%20in%20learning%20German%20at%20SAF%20Institute."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-[#25D366] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer"
          style={{ boxShadow: '0 8px 24px rgba(37,211,102,0.5)' }}
        >
          <i className="ri-whatsapp-line text-lg"></i>
          <span className="hidden xs:inline">Chat on WhatsApp</span>
          <span className="xs:hidden">WhatsApp</span>
        </a>

        {/* Book Free Consultation Button */}
        <div className="relative">
          <button
            onClick={handleBookConsultation}
            className="group flex items-center gap-2 bg-[#C7F000] text-[#0F6B3E] font-extrabold text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer"
            style={{ boxShadow: '0 8px 24px rgba(199,240,0,0.55)' }}
          >
            <i className="ri-calendar-check-line text-lg"></i>
            Book Free Consultation
            <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-200"></i>
          </button>
          <span className="absolute inset-0 rounded-full animate-ping bg-[#C7F000] opacity-15 pointer-events-none"></span>
        </div>
      </div>
    </div>
  );
}
