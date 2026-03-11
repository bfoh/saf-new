import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

export default function VisaConsultation() {
  const services = [
    {
      icon: 'ri-file-list-3-line',
      title: 'Document Preparation',
      description: 'Complete guidance on all required documents for your German visa application.',
    },
    {
      icon: 'ri-calendar-check-line',
      title: 'Application Support',
      description: 'Step-by-step assistance with filling out forms and scheduling embassy appointments.',
    },
    {
      icon: 'ri-user-search-line',
      title: 'Interview Coaching',
      description: 'Practice sessions to prepare you for your visa interview with confidence.',
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Success Guarantee',
      description: 'Our proven process has helped hundreds of students secure their German visas.',
    },
  ];

  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: servicesRef, visibleItems } = useStaggerAnimation(services.length);
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();

  return (
    <section id="visa" className="py-24 bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-2 border-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-800 ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDuration: '800ms' }}
          >
            <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
              Visa Support Services
            </div>
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-white mb-6">
              We Help You Get Your <span className="text-[#C7F000]">German Visa</span>
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Learning German is just the first step. Our comprehensive visa consultation service guides you through the entire application process, from document preparation to interview success.
            </p>

            {/* Services */}
            <div
              ref={servicesRef as React.RefObject<HTMLDivElement>}
              className="space-y-6 mb-10"
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`flex gap-4 items-start transition-all duration-500 ${visibleItems[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <i className={`${service.icon} text-2xl text-white`}></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">{service.title}</h3>
                    <p className="text-white/80 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-block bg-[#C7F000] text-[#1E1E1E] px-8 py-4 rounded-full font-semibold hover:bg-[#b8e000] transition-all duration-200 shadow-2xl hover:shadow-[#C7F000]/50 whitespace-nowrap cursor-pointer"
            >
              Schedule Visa Consultation
            </a>
          </div>

          {/* Right: Image */}
          <div
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className={`relative transition-all duration-800 ${imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transitionDuration: '800ms' }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20visa%20consultation%20meeting%2C%20African%20student%20reviewing%20documents%20with%20consultant%2C%20modern%20bright%20office%20setting%2C%20passport%20and%20application%20forms%20on%20desk%2C%20hopeful%20and%20positive%20atmosphere%2C%20natural%20lighting%2C%20professional%20photography%2C%20clean%20and%20organized%20workspace&width=800&height=900&seq=visa-consult-001&orientation=portrait"
                alt="Visa Consultation Service"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Floating Success Badge — desktop only */}
            <div
              className={`hidden lg:block absolute -top-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl transition-all duration-700 delay-500 ${imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] flex items-center justify-center">
                  <i className="ri-checkbox-circle-fill text-2xl text-white"></i>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F6B3E] font-['Poppins']">98%</div>
                  <div className="text-sm text-[#1E1E1E]/70 whitespace-nowrap">Visa Success</div>
                </div>
              </div>
            </div>

            {/* Mobile-only inline badge */}
            <div className="lg:hidden absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-xl text-[#0F6B3E]"></i>
              <span className="font-bold text-[#0F6B3E] font-['Poppins']">98% Visa Success</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
