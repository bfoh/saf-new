import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

export default function Opportunity() {
  const opportunities = [
    {
      icon: 'ri-graduation-cap-line',
      title: 'Study in Germany',
      description: 'Access world-class universities with low or no tuition fees and internationally recognized degrees.',
    },
    {
      icon: 'ri-briefcase-line',
      title: 'Work in Germany',
      description: 'Unlock career opportunities in Europe\'s largest economy with competitive salaries and benefits.',
    },
    {
      icon: 'ri-earth-line',
      title: 'Travel Europe',
      description: 'Experience the rich culture and history of German-speaking countries with confidence.',
    },
  ];

  const { ref: topRef, isVisible: topVisible } = useScrollAnimation();
  const { ref: cardsRef, visibleItems } = useStaggerAnimation(opportunities.length);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section className="py-24 bg-gradient-to-br from-[#0F6B3E] via-[#4CAF50] to-[#0F6B3E] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-48 h-48 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 border-2 border-white rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        {/* Top content */}
        <div
          ref={topRef as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-800 ${topVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          style={{ transitionDuration: '800ms' }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-8">
            <i className="ri-door-open-line text-4xl text-white"></i>
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Journey to Germany <br />
            <span className="text-[#C7F000]">Starts Here</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            Whether you're pursuing higher education, advancing your career, or exploring new opportunities, learning German opens doors to endless possibilities in Europe's strongest economy.
          </p>
        </div>

        {/* Opportunity Cards */}
        <div
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {opportunities.map((item, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-500 ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <i className={`${item.icon} text-3xl text-white`}></i>
              </div>
              <h3 className="font-['Poppins'] text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/80 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons & Trust Badge */}
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-700 delay-200 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#courses"
              className="bg-[#C7F000] text-[#1E1E1E] px-10 py-4 rounded-full text-lg font-bold hover:bg-[#b8e000] transition-all duration-300 shadow-2xl hover:shadow-[#C7F000]/50 hover:scale-105 whitespace-nowrap w-full sm:w-auto cursor-pointer"
            >
              Start Your Journey Today
            </a>
            <a
              href="#contact"
              className="bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/30 transition-all duration-300 shadow-2xl hover:scale-105 whitespace-nowrap w-full sm:w-auto cursor-pointer"
            >
              Talk to an Advisor
            </a>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
            <i className="ri-shield-check-line text-[#C7F000] text-xl"></i>
            <span className="text-white font-medium whitespace-nowrap">Trusted by 500+ Students</span>
          </div>
        </div>
      </div>
    </section>
  );
}
