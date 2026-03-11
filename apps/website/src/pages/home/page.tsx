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

      <div
        className={`fixed bottom-5 right-3 sm:bottom-8 sm:right-6 z-50 flex flex-col items-end gap-2 sm:gap-3 transition-all duration-500 ${showFloatingBtn
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
      >
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/233244506301?text=Hello%2C%20I%27m%20interested%20in%20learning%20German%20at%20SAF%20Institute."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-[#25D366] text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer"
          style={{ boxShadow: '0 8px 32px rgba(37,211,102,0.45)' }}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-whatsapp-line text-base"></i>
          </span>
          Chat on WhatsApp
        </a>

        {/* Book Free Consultation Button */}
        <div className="relative">
          <button
            onClick={handleBookConsultation}
            className="group flex items-center gap-2 bg-[#C7F000] text-[#0F6B3E] font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer"
            style={{ boxShadow: '0 8px 32px rgba(199,240,0,0.45)' }}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-calendar-check-line text-base"></i>
            </span>
            Book Free Consultation
            <span className="w-5 h-5 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
              <i className="ri-arrow-right-line text-base"></i>
            </span>
          </button>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-[#C7F000] opacity-20 pointer-events-none"></span>
        </div>
      </div>
    </div>
  );
}
