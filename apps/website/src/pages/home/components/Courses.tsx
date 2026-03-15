import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

const courses = [
  {
    level: 'A1',
    title: 'Beginner',
    description: 'Start your German journey from scratch. Learn basic vocabulary, grammar, and everyday conversations.',
    duration: '8 weeks',
    sessions: '24 sessions',
    hours: '48 hours',
    icon: 'ri-seedling-line',
    color: 'from-[#4CAF50] to-[#0F6B3E]',
    popular: false,
  },
  {
    level: 'A2',
    title: 'Elementary',
    description: 'Build on your foundation. Develop conversational skills and understand common expressions.',
    duration: '8 weeks',
    sessions: '24 sessions',
    hours: '48 hours',
    icon: 'ri-plant-line',
    color: 'from-[#0F6B3E] to-[#4CAF50]',
    popular: false,
  },
  {
    level: 'B1',
    title: 'Intermediate',
    description: 'Achieve fluency in everyday situations. Prepare for work and study in German-speaking countries.',
    duration: '10 weeks',
    sessions: '30 sessions',
    hours: '60 hours',
    icon: 'ri-leaf-line',
    color: 'from-[#4CAF50] to-[#C7F000]',
    popular: true,
  },
  {
    level: 'B2',
    title: 'Advanced',
    description: 'Master complex topics and professional communication. Ready for university and career advancement.',
    duration: '12 weeks',
    sessions: '36 sessions',
    hours: '72 hours',
    icon: 'ri-trophy-line',
    color: 'from-[#0F6B3E] to-[#C7F000]',
    popular: false,
  },
  {
    level: 'Private',
    title: 'Private Lessons',
    description: 'Personalized one-on-one instruction tailored to your goals, schedule, and learning pace.',
    duration: 'Flexible',
    sessions: 'Min. 5 sessions',
    hours: '2 hrs / session',
    icon: 'ri-user-star-line',
    color: 'from-[#C7F000] to-[#4CAF50]',
    popular: false,
  },
];

export default function Courses() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, visibleItems } = useStaggerAnimation(courses.length);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7F000]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0F6B3E]/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-lines opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-flex items-center gap-2 bg-[#0F6B3E]/10 text-[#0F6B3E] px-5 py-2 rounded-full text-sm font-bold mb-5">
            <i className="ri-book-open-line"></i>
            Our Courses
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-5 leading-tight">
            Choose Your{' '}
            <span className="relative">
              <span className="text-[#0F6B3E]">Learning Path</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M2 6C50 2 150 2 298 6" stroke="#C7F000" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-[#1E1E1E]/65 max-w-2xl mx-auto leading-relaxed">
            From complete beginner to advanced speaker — we have the perfect course to match your goals.
          </p>
        </div>

        {/* Course Cards */}
        <div
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {courses.map((course, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border cursor-pointer ${
                course.popular
                  ? 'border-[#0F6B3E]/30 ring-2 ring-[#0F6B3E]/20'
                  : 'border-gray-100 hover:border-[#0F6B3E]/20'
              } ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              {/* Most Popular badge */}
              {course.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#C7F000] text-[#0F6B3E] text-xs font-extrabold px-5 py-1.5 rounded-full shadow-lg whitespace-nowrap z-10 tracking-wide">
                  <i className="ri-star-fill text-[10px]"></i>
                  MOST POPULAR
                  <i className="ri-star-fill text-[10px]"></i>
                </div>
              )}

              {/* Hover shimmer */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 animate-shimmer"></div>
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400 shadow-lg`}>
                <i className={`${course.icon} text-2xl text-white`}></i>
              </div>

              {/* Level badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#F6F9F3] text-[#0F6B3E] px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B3E]/60"></span>
                {course.level}
              </div>

              <h3 className="font-['Poppins'] text-xl font-bold text-[#1E1E1E] mb-2.5">
                {course.title}
              </h3>
              <p className="text-[#1E1E1E]/65 mb-5 leading-relaxed text-sm">
                {course.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-6 text-xs text-[#1E1E1E]/55">
                <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full">
                  <i className="ri-time-line text-[#0F6B3E]"></i>
                  {course.duration}
                </span>
                <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full">
                  <i className="ri-calendar-line text-[#0F6B3E]"></i>
                  {course.sessions}
                </span>
                <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full">
                  <i className="ri-book-open-line text-[#0F6B3E]"></i>
                  {course.hours}
                </span>
              </div>

              {/* CTA */}
              <a
                href="#contact"
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm transition-all duration-300 group-hover:gap-3 ${
                  course.popular
                    ? 'bg-gradient-to-r from-[#0F6B3E] to-[#4CAF50] text-white shadow-lg shadow-[#0F6B3E]/20 hover:shadow-xl hover:shadow-[#0F6B3E]/30'
                    : 'bg-[#F6F9F3] text-[#0F6B3E] hover:bg-[#0F6B3E] hover:text-white'
                }`}
              >
                Enrol Now
                <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-1"></i>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`text-center mt-14 transition-all duration-700 delay-200 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-[#1E1E1E]/60 mb-4 text-sm">Not sure which course is right for you?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 bg-[#C7F000] text-[#1E1E1E] px-9 py-3.5 rounded-full font-bold hover:bg-[#b8e000] transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer"
          >
            <i className="ri-customer-service-2-line text-lg"></i>
            Get Free Course Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
