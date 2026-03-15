import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

const opportunities = [
  {
    icon: 'ri-graduation-cap-line',
    title: 'Study in Germany',
    stat: 'Free tuition',
    description: 'Access world-class universities with low or no tuition fees and internationally recognised degrees.',
  },
  {
    icon: 'ri-briefcase-line',
    title: 'Work in Germany',
    stat: '€45k avg salary',
    description: "Unlock career opportunities in Europe's largest economy with competitive salaries and top benefits.",
  },
  {
    icon: 'ri-earth-line',
    title: 'Travel Europe',
    stat: '26 countries',
    description: 'Experience the rich culture and history of German-speaking countries across the Schengen area.',
  },
];

export default function Opportunity() {
  const { ref: topRef, isVisible: topVisible } = useScrollAnimation();
  const { ref: cardsRef, visibleItems } = useStaggerAnimation(opportunities.length);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a5530 0%, #0F6B3E 35%, #2d9e5c 70%, #0F6B3E 100%)' }}>
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-dot-grid-white pointer-events-none"></div>

      {/* Animated circle rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] border border-white/8 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-ring"></div>
        <div className="absolute top-0 left-0 w-[300px] h-[300px] border border-white/12 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] border border-white/8 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 right-0 w-[250px] h-[250px] border border-white/10 rounded-full translate-x-1/2 -translate-y-1/2 animate-float-slow"></div>
      </div>

      {/* Lime accent glow top-right */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7F000]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10 text-center">
        {/* Top content */}
        <div
          ref={topRef as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-700 ${topVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {/* Icon badge */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <i className="ri-door-open-line text-4xl text-white"></i>
              </div>
              <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse-ring"></div>
            </div>
          </div>

          <h2 className="font-['Poppins'] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
            Your Journey to Germany{' '}
            <br className="hidden sm:block" />
            <span className="text-[#C7F000] drop-shadow-lg">Starts Here</span>
          </h2>
          <p className="text-lg md:text-xl text-white/85 mb-14 leading-relaxed max-w-2xl mx-auto">
            Whether you're pursuing higher education, advancing your career, or exploring new horizons — German opens doors to endless possibilities.
          </p>
        </div>

        {/* Opportunity Cards */}
        <div
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className="grid sm:grid-cols-3 gap-5 mb-14"
        >
          {opportunities.map((item, index) => (
            <div
              key={index}
              className={`group relative bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/15 hover:bg-white/18 hover:border-white/30 hover:-translate-y-1.5 transition-all duration-400 ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Stat badge */}
              <div className="absolute top-4 right-4 bg-[#C7F000]/25 text-[#C7F000] text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap border border-[#C7F000]/30">
                {item.stat}
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300 border border-white/20">
                <i className={`${item.icon} text-3xl text-white`}></i>
              </div>
              <h3 className="font-['Poppins'] text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-700 delay-200 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#courses"
              className="relative overflow-hidden inline-flex items-center gap-2.5 bg-[#C7F000] text-[#0F6B3E] px-10 py-4 rounded-full text-base font-extrabold hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-[#C7F000]/40 hover:scale-105 whitespace-nowrap w-full sm:w-auto cursor-pointer"
            >
              <i className="ri-rocket-line text-lg"></i>
              Start Your Journey Today
              <span className="absolute inset-0 animate-shimmer rounded-full pointer-events-none"></span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 bg-white/15 border-2 border-white/40 backdrop-blur-sm text-white px-10 py-4 rounded-full text-base font-bold hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:scale-105 whitespace-nowrap w-full sm:w-auto cursor-pointer"
            >
              <i className="ri-customer-service-2-line text-lg"></i>
              Talk to an Advisor
            </a>
          </div>

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full">
            <i className="ri-shield-check-fill text-[#C7F000] text-lg"></i>
            <span className="text-white font-semibold text-sm whitespace-nowrap">Trusted by 500+ Students across Ghana</span>
          </div>
        </div>
      </div>
    </section>
  );
}
