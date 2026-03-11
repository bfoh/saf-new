import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Kwame Mensah',
      role: 'Medical Student in Berlin',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20confident%20young%20Ghanaian%20male%20student%20in%20his%20twenties%2C%20wearing%20casual%20smart%20clothing%2C%20warm%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20authentic%20and%20approachable%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-001&orientation=squarish',
      quote: 'SAF Institute prepared me perfectly for my studies in Germany. The instructors are patient, knowledgeable, and truly care about your success. I passed my B2 exam on the first try!',
      rating: 5,
    },
    {
      name: 'Ama Osei',
      role: 'Nurse in Frankfurt',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20confident%20young%20Ghanaian%20female%20professional%20in%20her%20twenties%2C%20wearing%20professional%20attire%2C%20warm%20genuine%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20authentic%20and%20friendly%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-002&orientation=squarish',
      quote: 'The visa consultation service was invaluable. They guided me through every step of the process, and I\'m now working as a nurse in Frankfurt. Thank you SAF Institute!',
      rating: 5,
    },
    {
      name: 'Kofi Asante',
      role: 'Engineering Student in Munich',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20young%20Ghanaian%20male%20student%20in%20his%20early%20twenties%2C%20wearing%20casual%20shirt%2C%20confident%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20approachable%20and%20intelligent%20look%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-003&orientation=squarish',
      quote: 'The small class sizes made all the difference. I got personalized attention and could practice speaking without feeling intimidated. Highly recommend SAF Institute!',
      rating: 5,
    },
    {
      name: 'Abena Boateng',
      role: 'Business Professional in Hamburg',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20confident%20young%20Ghanaian%20female%20business%20professional%20in%20her%20mid%20twenties%2C%20wearing%20professional%20business%20attire%2C%20warm%20professional%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20polished%20and%20successful%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-004&orientation=squarish',
      quote: 'From A1 to B2, SAF Institute has been with me every step of the way. The quality of teaching is world-class, and the results speak for themselves.',
      rating: 5,
    },
    {
      name: 'Yaw Owusu',
      role: 'IT Specialist in Cologne',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20young%20Ghanaian%20male%20tech%20professional%20in%20his%20twenties%2C%20wearing%20smart%20casual%20attire%2C%20friendly%20confident%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20modern%20and%20professional%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-005&orientation=squarish',
      quote: 'The online classes were just as effective as in-person. The platform is easy to use, and the teachers make learning German fun and engaging.',
      rating: 5,
    },
    {
      name: 'Efua Adjei',
      role: 'PhD Candidate in Heidelberg',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20intelligent%20young%20Ghanaian%20female%20academic%20in%20her%20mid%20twenties%2C%20wearing%20professional%20academic%20attire%2C%20warm%20confident%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20scholarly%20and%20approachable%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-006&orientation=squarish',
      quote: 'The exam preparation was thorough and effective. I felt confident going into my Goethe-Institut exam and achieved the score I needed for my PhD program.',
      rating: 5,
    },
  ];

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, visibleItems } = useStaggerAnimation(testimonials.length);
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0F6B3E]/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-block bg-[#0F6B3E]/10 text-[#0F6B3E] px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
            Student Success Stories
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
            What Our <span className="text-[#0F6B3E]">Students Say</span>
          </h2>
          <p className="text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto">
            Join hundreds of successful students who achieved their German language goals with SAF Institute.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-[#F6F9F3] rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-[#C7F000] text-lg"></i>
                ))}
              </div>
              <p className="text-[#1E1E1E]/80 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <div className="font-semibold text-[#1E1E1E]">{testimonial.name}</div>
                  <div className="text-sm text-[#1E1E1E]/60">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '500+', label: 'Happy Students' },
            { value: '95%', label: 'Success Rate' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '10+', label: 'Years Experience' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-600 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms`, transitionDuration: '600ms' }}
            >
              <div className="text-4xl font-bold text-[#0F6B3E] font-['Poppins'] mb-2">{stat.value}</div>
              <div className="text-[#1E1E1E]/70 whitespace-nowrap">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
