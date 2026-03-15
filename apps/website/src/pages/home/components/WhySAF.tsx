import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

const reasons = [
  {
    icon: 'ri-award-line',
    title: 'Certified Excellence',
    description: 'Accredited by international language education bodies with a proven track record of student success.',
  },
  {
    icon: 'ri-user-star-line',
    title: 'Expert Instructors',
    description: 'Native German speakers and certified teachers with extensive experience in immersive language education.',
  },
  {
    icon: 'ri-book-open-line',
    title: 'Comprehensive Curriculum',
    description: 'Structured courses aligned with CEFR standards, from complete beginner to advanced proficiency.',
  },
  {
    icon: 'ri-team-line',
    title: 'Small Class Sizes',
    description: 'Maximum 12 students per class ensures personalised attention and accelerated learning outcomes.',
  },
  {
    icon: 'ri-calendar-check-line',
    title: 'Flexible Learning',
    description: 'Choose from in-person, online, or hybrid classes — any schedule, any lifestyle.',
  },
  {
    icon: 'ri-global-line',
    title: 'Modern Technology',
    description: 'Interactive digital learning platform with multimedia resources and progress-tracking tools.',
  },
  {
    icon: 'ri-medal-line',
    title: 'Exam Preparation',
    description: 'Specialised training for Goethe-Institut and telc certifications — 95% first-attempt pass rate.',
  },
  {
    icon: 'ri-passport-line',
    title: 'Visa Support',
    description: 'Complete guidance through the German visa application process from document prep to interview coaching.',
  },
  {
    icon: 'ri-community-line',
    title: 'Student Community',
    description: 'Join a vibrant community of learners with networking events and German cultural activities.',
  },
];

export default function WhySAF() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, visibleItems } = useStaggerAnimation(reasons.length);
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  return (
    <section id="why-saf" className="py-24 bg-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-[#0F6B3E]/8 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#C7F000]/8 rounded-full blur-3xl pointer-events-none"></div>
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-lines pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-flex items-center gap-2 bg-[#0F6B3E]/10 text-[#0F6B3E] px-5 py-2 rounded-full text-sm font-bold mb-5">
            <i className="ri-check-double-line"></i>
            Why Choose Us
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-5">
            Why <span className="text-[#0F6B3E]">SAF Institute</span> is Different
          </h2>
          <p className="text-lg text-[#1E1E1E]/65 max-w-2xl mx-auto leading-relaxed">
            We're not just a language school — we're your partner in making your German dream a reality.
          </p>
        </div>

        {/* Reasons Grid */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`group relative bg-[#F6F9F3] rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-400 hover:-translate-y-1 border border-transparent hover:border-[#0F6B3E]/10 ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 65}ms` }}
            >
              {/* Subtle left accent bar on hover */}
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-[#0F6B3E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <i className={`${reason.icon} text-xl text-white`}></i>
                </div>
                <div>
                  <h3 className="font-['Poppins'] text-base font-bold text-[#1E1E1E] mb-1.5">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-[#1E1E1E]/65 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className={`relative overflow-hidden bg-gradient-to-r from-[#0F6B3E] via-[#1a8a50] to-[#4CAF50] rounded-3xl p-10 md:p-14 text-center transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
        >
          {/* Dot grid overlay */}
          <div className="absolute inset-0 bg-dot-grid-white pointer-events-none"></div>
          {/* Shimmer sweep */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10+', label: 'Years Experience', icon: 'ri-history-line' },
              { value: '500+', label: 'Students Taught', icon: 'ri-group-line' },
              { value: '95%', label: 'Exam Pass Rate', icon: 'ri-medal-line' },
              { value: '98%', label: 'Visa Success', icon: 'ri-passport-line' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mx-auto mb-3">
                  <i className={`${stat.icon} text-xl text-white/90`}></i>
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-white font-['Poppins'] mb-1.5 drop-shadow-lg">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm font-medium whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
