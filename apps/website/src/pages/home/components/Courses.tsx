import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

export default function Courses() {
  const courses = [
    {
      level: 'A1',
      title: 'Beginner',
      description: 'Start your German journey from scratch. Learn basic vocabulary, grammar, and everyday conversations.',
      duration: '8 weeks',
      hours: '60 hours',
      icon: 'ri-seedling-line',
      color: 'from-[#4CAF50] to-[#0F6B3E]',
    },
    {
      level: 'A2',
      title: 'Elementary',
      description: 'Build on your foundation. Develop conversational skills and understand common expressions.',
      duration: '10 weeks',
      hours: '80 hours',
      icon: 'ri-plant-line',
      color: 'from-[#0F6B3E] to-[#4CAF50]',
    },
    {
      level: 'B1',
      title: 'Intermediate',
      description: 'Achieve fluency in everyday situations. Prepare for work and study in German-speaking countries.',
      duration: '12 weeks',
      hours: '100 hours',
      icon: 'ri-leaf-line',
      color: 'from-[#4CAF50] to-[#C7F000]',
    },
    {
      level: 'B2',
      title: 'Advanced',
      description: 'Master complex topics and professional communication. Ready for university and career advancement.',
      duration: '14 weeks',
      hours: '120 hours',
      icon: 'ri-trophy-line',
      color: 'from-[#0F6B3E] to-[#C7F000]',
    },
    {
      level: 'Private',
      title: 'Private Lessons',
      description: 'Personalized one-on-one instruction tailored to your goals, schedule, and learning pace.',
      duration: 'Flexible',
      hours: 'Custom',
      icon: 'ri-user-star-line',
      color: 'from-[#C7F000] to-[#4CAF50]',
    },
  ];

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, visibleItems } = useStaggerAnimation(courses.length);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7F000]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0F6B3E]/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-block bg-[#0F6B3E]/10 text-[#0F6B3E] px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
            Our Courses
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
            Choose Your <span className="text-[#0F6B3E]">Learning Path</span>
          </h2>
          <p className="text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto">
            From complete beginner to advanced speaker, we have the perfect course to match your goals and current level.
          </p>
        </div>

        {/* Course Cards */}
        <div
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, index) => (
            <div
              key={index}
              className={`group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${course.icon} text-3xl text-white`}></i>
              </div>
              <div className="inline-block bg-[#F6F9F3] text-[#0F6B3E] px-4 py-1 rounded-full text-sm font-bold mb-3 whitespace-nowrap">
                {course.level}
              </div>
              <h3 className="font-['Poppins'] text-2xl font-bold text-[#1E1E1E] mb-3">
                {course.title}
              </h3>
              <p className="text-[#1E1E1E]/70 mb-6 leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center gap-4 mb-6 text-sm text-[#1E1E1E]/60">
                <div className="flex items-center gap-1">
                  <i className="ri-time-line"></i>
                  <span className="whitespace-nowrap">{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="ri-book-open-line"></i>
                  <span className="whitespace-nowrap">{course.hours}</span>
                </div>
              </div>
              <button className="w-full bg-[#0F6B3E] text-white py-3 rounded-full font-semibold hover:bg-[#0d5a33] transition-colors duration-200 group-hover:shadow-lg whitespace-nowrap">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`text-center mt-12 transition-all duration-700 delay-200 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-[#1E1E1E]/70 mb-4">Not sure which course is right for you?</p>
          <a
            href="#contact"
            className="inline-block bg-[#C7F000] text-[#1E1E1E] px-8 py-3 rounded-full font-semibold hover:bg-[#b8e000] transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
          >
            Get Free Course Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
