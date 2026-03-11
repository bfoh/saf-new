import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

export default function LearningExperience() {
  const features = [
    {
      icon: 'ri-user-star-line',
      title: 'Expert Native Instructors',
      description: 'Learn from certified German teachers with years of experience in language education.',
    },
    {
      icon: 'ri-team-line',
      title: 'Small Class Sizes',
      description: 'Maximum 12 students per class ensures personalized attention and faster progress.',
    },
    {
      icon: 'ri-calendar-check-line',
      title: 'Flexible Scheduling',
      description: 'Choose from morning, afternoon, or evening classes that fit your lifestyle.',
    },
    {
      icon: 'ri-book-open-line',
      title: 'Comprehensive Materials',
      description: 'Access to textbooks, online resources, and practice materials included in your course.',
    },
    {
      icon: 'ri-global-line',
      title: 'Interactive Learning',
      description: 'Engage with multimedia content, group activities, and real-world conversation practice.',
    },
    {
      icon: 'ri-medal-line',
      title: 'Exam Preparation',
      description: 'Structured preparation for Goethe-Institut and telc German language certifications.',
    },
  ];

  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: featuresRef, visibleItems } = useStaggerAnimation(features.length);

  return (
    <section className="py-24 bg-[#F6F9F3] relative overflow-hidden">
      <div className="absolute top-20 left-0 w-72 h-72 bg-[#4CAF50]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#C7F000]/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className={`relative transition-all duration-800 ${imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDuration: '800ms' }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://readdy.ai/api/search-image?query=Diverse%20African%20students%20actively%20participating%20in%20an%20engaging%20German%20language%20class%2C%20modern%20bright%20classroom%20with%20interactive%20whiteboard%2C%20students%20smiling%20and%20raising%20hands%2C%20collaborative%20learning%20environment%2C%20natural%20lighting%2C%20professional%20educational%20photography%2C%20warm%20and%20inviting%20atmosphere%2C%20contemporary%20furniture&width=800&height=900&seq=learning-exp-001&orientation=portrait"
                alt="SAF Institute Learning Experience"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className={`absolute bottom-4 right-4 bg-white rounded-2xl p-4 sm:p-6 shadow-2xl transition-all duration-700 delay-300 ${imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="text-4xl font-bold text-[#0F6B3E] font-['Poppins']">95%</div>
              <div className="text-sm text-[#1E1E1E]/70 whitespace-nowrap">Pass Rate</div>
            </div>
          </div>

          {/* Right: Content */}
          <div
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-800 ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transitionDuration: '800ms' }}
          >
            <div className="inline-block bg-[#0F6B3E]/10 text-[#0F6B3E] px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
              Learning Experience
            </div>
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-6">
              Why Students <span className="text-[#0F6B3E]">Love Learning</span> With Us
            </h2>
            <p className="text-lg text-[#1E1E1E]/70 mb-10 leading-relaxed">
              At SAF Institute, we combine proven teaching methods with modern technology to create an immersive learning experience that gets results.
            </p>

            {/* Features Grid */}
            <div
              ref={featuresRef as React.RefObject<HTMLDivElement>}
              className="grid sm:grid-cols-2 gap-6"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex gap-4 transition-all duration-500 ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] flex items-center justify-center">
                      <i className={`${feature.icon} text-xl text-white`}></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1E1E1E] mb-1">{feature.title}</h3>
                    <p className="text-sm text-[#1E1E1E]/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="#courses"
                className="inline-block bg-[#0F6B3E] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#0d5a33] transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
              >
                Explore Our Courses
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
