import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

export default function WhySAF() {
  const reasons = [
    {
      icon: 'ri-award-line',
      title: 'Certified Excellence',
      description: 'Accredited by international language education bodies with proven track record of student success.',
    },
    {
      icon: 'ri-user-star-line',
      title: 'Expert Instructors',
      description: 'Native German speakers and certified teachers with extensive experience in language education.',
    },
    {
      icon: 'ri-book-open-line',
      title: 'Comprehensive Curriculum',
      description: 'Structured courses aligned with CEFR standards, from complete beginner to advanced proficiency.',
    },
    {
      icon: 'ri-team-line',
      title: 'Small Class Sizes',
      description: 'Maximum 12 students per class ensures personalized attention and accelerated learning.',
    },
    {
      icon: 'ri-calendar-check-line',
      title: 'Flexible Learning',
      description: 'Choose from in-person, online, or hybrid classes that fit your schedule and learning style.',
    },
    {
      icon: 'ri-global-line',
      title: 'Modern Technology',
      description: 'Interactive digital learning platform with multimedia resources and practice materials.',
    },
    {
      icon: 'ri-medal-line',
      title: 'Exam Preparation',
      description: 'Specialized training for Goethe-Institut and telc certifications with 95% pass rate.',
    },
    {
      icon: 'ri-passport-line',
      title: 'Visa Support',
      description: 'Complete guidance through the German visa application process from start to finish.',
    },
    {
      icon: 'ri-community-line',
      title: 'Student Community',
      description: 'Join a vibrant community of learners with networking events and cultural activities.',
    },
  ];

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, visibleItems } = useStaggerAnimation(reasons.length);
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  return (
    <section id="why-saf" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-20 left-0 w-96 h-96 bg-[#0F6B3E]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#C7F000]/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-block bg-[#0F6B3E]/10 text-[#0F6B3E] px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
            Why Choose Us
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
            Why <span className="text-[#0F6B3E]">SAF Institute</span> is Different
          </h2>
          <p className="text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto">
            We're not just a language school. We're your partner in achieving your German language goals and making your dreams of studying or working in Germany a reality.
          </p>
        </div>

        {/* Reasons Grid */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`group bg-[#F6F9F3] rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className={`${reason.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="font-['Poppins'] text-xl font-bold text-[#1E1E1E] mb-3">
                {reason.title}
              </h3>
              <p className="text-[#1E1E1E]/70 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className={`bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] rounded-3xl p-12 text-center transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10+', label: 'Years Experience' },
              { value: '500+', label: 'Students Taught' },
              { value: '95%', label: 'Exam Pass Rate' },
              { value: '98%', label: 'Visa Success' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                <div className="text-5xl font-bold text-white font-['Poppins'] mb-2">{stat.value}</div>
                <div className="text-white/90 whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
