import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

const features = [
  {
    icon: 'ri-user-star-line',
    title: 'Expert Native Instructors',
    description: 'Certified German teachers with years of experience and immersive coaching techniques.',
  },
  {
    icon: 'ri-team-line',
    title: 'Small Class Sizes',
    description: 'Maximum 12 students per class — personalised attention that accelerates your progress.',
  },
  {
    icon: 'ri-calendar-check-line',
    title: 'Flexible Scheduling',
    description: 'Morning, afternoon, or evening classes to fit your busy lifestyle.',
  },
  {
    icon: 'ri-book-open-line',
    title: 'Comprehensive Materials',
    description: 'Textbooks, digital resources, and practice materials all included in your course fee.',
  },
  {
    icon: 'ri-global-line',
    title: 'Interactive Learning',
    description: 'Multimedia content, group activities, and real-world conversation practice every session.',
  },
  {
    icon: 'ri-medal-line',
    title: 'Exam Preparation',
    description: 'Structured prep for Goethe-Institut and telc certifications — 95% pass rate.',
  },
];

export default function LearningExperience() {
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: featuresRef, visibleItems } = useStaggerAnimation(features.length);

  return (
    <section className="py-24 bg-[#F6F9F3] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-[#4CAF50]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#C7F000]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Image + floating cards */}
          <div
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className={`relative transition-all duration-800 ${imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDuration: '800ms' }}
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://readdy.ai/api/search-image?query=Diverse%20African%20students%20actively%20participating%20in%20an%20engaging%20German%20language%20class%2C%20modern%20bright%20classroom%20with%20interactive%20whiteboard%2C%20students%20smiling%20and%20raising%20hands%2C%20collaborative%20learning%20environment%2C%20natural%20lighting%2C%20professional%20educational%20photography%2C%20warm%20and%20inviting%20atmosphere%2C%20contemporary%20furniture&width=800&height=900&seq=learning-exp-001&orientation=portrait"
                alt="SAF Institute Learning Experience"
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0F6B3E]/30 to-transparent"></div>
            </div>

            {/* Floating stat card — bottom right */}
            <div
              className={`absolute bottom-5 right-4 sm:-right-5 bg-white rounded-2xl px-5 py-4 shadow-2xl border border-gray-100 animate-float transition-all duration-700 delay-300 ${imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <i className="ri-medal-fill text-xl text-white"></i>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#0F6B3E] font-['Poppins'] leading-none">95%</div>
                  <div className="text-xs text-[#1E1E1E]/60 font-medium mt-0.5 whitespace-nowrap">Exam Pass Rate</div>
                </div>
              </div>
            </div>

            {/* Floating students badge — top left */}
            <div
              className={`absolute top-5 -left-2 sm:-left-5 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 animate-float-slow transition-all duration-700 delay-500 ${imageVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#4CAF50] to-[#0F6B3E] flex items-center justify-center"
                    >
                      <i className="ri-user-fill text-white text-xs"></i>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1E1E1E]">500+ Students</div>
                  <div className="text-xs text-[#1E1E1E]/50">Enrolled & learning</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-800 ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transitionDuration: '800ms' }}
          >
            <div className="inline-flex items-center gap-2 bg-[#0F6B3E]/10 text-[#0F6B3E] px-5 py-2 rounded-full text-sm font-bold mb-5">
              <i className="ri-star-line"></i>
              Learning Experience
            </div>
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-5 leading-tight">
              Why Students{' '}
              <span className="text-[#0F6B3E]">Love Learning</span>{' '}
              With Us
            </h2>
            <p className="text-lg text-[#1E1E1E]/65 mb-10 leading-relaxed">
              At SAF Institute, we combine proven teaching methods with modern technology to create an immersive experience that gets real results — fast.
            </p>

            {/* Features Grid */}
            <div
              ref={featuresRef as React.RefObject<HTMLDivElement>}
              className="grid sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group flex gap-3.5 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-default ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                      <i className={`${feature.icon} text-lg text-white`}></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E1E1E] mb-1 text-sm leading-snug">{feature.title}</h3>
                    <p className="text-xs text-[#1E1E1E]/65 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 bg-[#0F6B3E] text-white px-7 py-3.5 rounded-full font-bold hover:bg-[#0d5a33] transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-right-circle-line text-lg"></i>
                Explore Courses
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border-2 border-[#0F6B3E] text-[#0F6B3E] px-7 py-3.5 rounded-full font-bold hover:bg-[#0F6B3E] hover:text-white transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-check-line text-lg"></i>
                Free Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
