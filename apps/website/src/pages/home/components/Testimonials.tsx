import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const testimonials = [
  {
    name: 'Kwame Mensah',
    role: 'Medical Student, Berlin',
    image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20confident%20young%20Ghanaian%20male%20student%20in%20his%20twenties%2C%20wearing%20casual%20smart%20clothing%2C%20warm%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20authentic%20and%20approachable%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-001&orientation=squarish',
    quote: 'SAF Institute prepared me perfectly for my studies in Germany. The instructors are patient, knowledgeable, and truly care about your success. I passed my B2 exam on the first try!',
    rating: 5,
    level: 'B2 Graduate',
  },
  {
    name: 'Ama Osei',
    role: 'Nurse, Frankfurt',
    image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20confident%20young%20Ghanaian%20female%20professional%20in%20her%20twenties%2C%20wearing%20professional%20attire%2C%20warm%20genuine%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20authentic%20and%20friendly%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-002&orientation=squarish',
    quote: "The visa consultation service was invaluable. They guided me through every step of the process, and I'm now working as a nurse in Frankfurt. Thank you SAF Institute!",
    rating: 5,
    level: 'Visa Consultation',
  },
  {
    name: 'Kofi Asante',
    role: 'Engineering Student, Munich',
    image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20young%20Ghanaian%20male%20student%20in%20his%20early%20twenties%2C%20wearing%20casual%20shirt%2C%20confident%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20approachable%20and%20intelligent%20look%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-003&orientation=squarish',
    quote: 'The small class sizes made all the difference. I got personalized attention and could practice speaking without feeling intimidated. Highly recommend SAF Institute!',
    rating: 5,
    level: 'B1 Graduate',
  },
  {
    name: 'Abena Boateng',
    role: 'Business Professional, Hamburg',
    image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20confident%20young%20Ghanaian%20female%20business%20professional%20in%20her%20mid%20twenties%2C%20wearing%20professional%20business%20attire%2C%20warm%20professional%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20polished%20and%20successful%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-004&orientation=squarish',
    quote: 'From A1 to B2, SAF Institute has been with me every step of the way. The quality of teaching is world-class, and the results speak for themselves.',
    rating: 5,
    level: 'A1 → B2 Journey',
  },
  {
    name: 'Yaw Owusu',
    role: 'IT Specialist, Cologne',
    image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20young%20Ghanaian%20male%20tech%20professional%20in%20his%20twenties%2C%20wearing%20smart%20casual%20attire%2C%20friendly%20confident%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20modern%20and%20professional%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-005&orientation=squarish',
    quote: 'The online classes were just as effective as in-person. The platform is easy to use, and the teachers make learning German fun and engaging.',
    rating: 5,
    level: 'Online Student',
  },
  {
    name: 'Efua Adjei',
    role: 'PhD Candidate, Heidelberg',
    image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20intelligent%20young%20Ghanaian%20female%20academic%20in%20her%20mid%20twenties%2C%20wearing%20professional%20academic%20attire%2C%20warm%20confident%20smile%2C%20natural%20lighting%2C%20clean%20simple%20background%2C%20scholarly%20and%20approachable%2C%20high%20quality%20photography&width=400&height=400&seq=testimonial-006&orientation=squarish',
    quote: 'The exam preparation was thorough and effective. I felt confident going into my Goethe-Institut exam and achieved the score I needed for my PhD program.',
    rating: 5,
    level: 'B2 Graduate',
  },
];

/* Individual testimonial card */
function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[320px] sm:w-[360px] bg-white rounded-3xl p-7 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 cursor-default mx-3">
      {/* Large quote mark */}
      <div className="text-5xl font-serif text-[#0F6B3E]/15 leading-none mb-3 select-none">"</div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(t.rating)].map((_, i) => (
          <i key={i} className="ri-star-fill text-[#C7F000] text-base"></i>
        ))}
      </div>

      {/* Quote */}
      <p className="text-[#1E1E1E]/75 leading-relaxed text-sm mb-6 line-clamp-4">
        {t.quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#0F6B3E]/15">
          <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[#1E1E1E] text-sm truncate">{t.name}</div>
          <div className="text-xs text-[#1E1E1E]/55 truncate">{t.role}</div>
        </div>
        <div className="flex-shrink-0 bg-[#F6F9F3] text-[#0F6B3E] text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
          {t.level}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  // Duplicate for seamless loop
  const doubled = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 bg-[#F6F9F3] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0F6B3E]/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C7F000]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 px-5 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-flex items-center gap-2 bg-[#0F6B3E]/10 text-[#0F6B3E] px-5 py-2 rounded-full text-sm font-bold mb-5">
            <i className="ri-emotion-happy-line"></i>
            Student Success Stories
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-5">
            What Our <span className="text-[#0F6B3E]">Students Say</span>
          </h2>
          <p className="text-lg text-[#1E1E1E]/65 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of successful students who achieved their German language goals with SAF Institute.
          </p>
        </div>

        {/* Marquee Row 1 — left to right */}
        <div className="relative overflow-hidden mb-5">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F6F9F3] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F6F9F3] to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-marquee" style={{ width: 'max-content' }}>
            {doubled.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 — right to left (reversed) */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F6F9F3] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F6F9F3] to-transparent z-10 pointer-events-none"></div>

          <div
            className="flex"
            style={{
              width: 'max-content',
              animation: 'marquee 40s linear infinite reverse',
            }}
          >
            {[...doubled].reverse().map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className={`mt-16 max-w-4xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {[
            { value: '500+', label: 'Happy Students', icon: 'ri-group-line' },
            { value: '95%', label: 'Success Rate', icon: 'ri-medal-line' },
            { value: '4.9/5', label: 'Average Rating', icon: 'ri-star-fill' },
            { value: '10+', label: 'Years Experience', icon: 'ri-history-line' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`text-center bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#0F6B3E]/10 flex items-center justify-center mx-auto mb-3">
                <i className={`${stat.icon} text-[#0F6B3E] text-lg`}></i>
              </div>
              <div className="text-3xl font-extrabold text-[#0F6B3E] font-['Poppins'] mb-1">{stat.value}</div>
              <div className="text-sm text-[#1E1E1E]/60 font-medium whitespace-nowrap">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
