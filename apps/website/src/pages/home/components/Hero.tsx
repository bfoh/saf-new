export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://readdy.ai/api/search-image?query=Modern%20minimalist%20educational%20environment%20with%20soft%20natural%20lighting%2C%20young%20diverse%20African%20students%20studying%20German%20language%20in%20a%20contemporary%20classroom%20with%20wooden%20desks%20and%20green%20plants%2C%20warm%20atmosphere%2C%20professional%20photography%2C%20shallow%20depth%20of%20field%2C%20natural%20window%20light%2C%20clean%20aesthetic%2C%20inspirational%20learning%20space&width=1920&height=1080&seq=hero-bg-saf-001&orientation=landscape"
          alt="SAF Institute Learning Environment"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>
      </div>

      {/* Floating Abstract Shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#C7F000]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#0F6B3E]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <i className="ri-global-line text-[#0F6B3E] text-lg"></i>
              <span className="text-sm font-medium text-[#1E1E1E] whitespace-nowrap">Online & In-Person Classes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <i className="ri-user-star-line text-[#0F6B3E] text-lg"></i>
              <span className="text-sm font-medium text-[#1E1E1E] whitespace-nowrap">1-on-1 Coaching</span>
            </div>
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <i className="ri-passport-line text-[#0F6B3E] text-lg"></i>
              <span className="text-sm font-medium text-[#1E1E1E] whitespace-nowrap">Visa Consultation</span>
            </div>
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <i className="ri-team-line text-[#0F6B3E] text-lg"></i>
              <span className="text-sm font-medium text-[#1E1E1E] whitespace-nowrap">Small Class Sizes</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-['Poppins'] text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Open the Door to Germany.
            <br />
            <span className="text-[#C7F000]">Start Speaking German</span> With Confidence.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Learn German in Ghana with expert instructors and structured courses designed to prepare you for study, work and travel opportunities in Germany.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#courses"
              className="bg-[#0F6B3E] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#0d5a33] transition-all duration-300 shadow-2xl hover:shadow-[#0F6B3E]/50 hover:scale-105 whitespace-nowrap w-full sm:w-auto cursor-pointer"
            >
              Start Learning German
            </a>
            <a
              href="#contact"
              className="bg-white text-[#0F6B3E] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:scale-105 whitespace-nowrap w-full sm:w-auto cursor-pointer"
            >
              Book Free Consultation
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C7F000] font-['Poppins']">500+</div>
              <div className="text-white/80 mt-1 whitespace-nowrap">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C7F000] font-['Poppins']">95%</div>
              <div className="text-white/80 mt-1 whitespace-nowrap">Exam Success</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C7F000] font-['Poppins']">2</div>
              <div className="text-white/80 mt-1 whitespace-nowrap">Accra & Kumasi Locations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <i className="ri-arrow-down-line text-white text-3xl"></i>
        </div>
      </div>
    </section>
  );
}
