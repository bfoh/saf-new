import { useState } from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const faqs = [
  {
    category: 'Courses',
    icon: 'ri-book-open-line',
    questions: [
      {
        q: 'What German language levels do you offer?',
        a: 'We offer courses from A1 (complete beginner) through B2 (upper-intermediate), covering all CEFR levels. We also offer Private Lessons tailored to your specific goals and pace.',
      },
      {
        q: 'How long does each course level take to complete?',
        a: 'Each level typically takes 8–12 weeks depending on the class format. Intensive courses can be completed faster, while standard evening classes are spread over 10–12 weeks.',
      },
      {
        q: 'Do you offer online or hybrid classes?',
        a: 'Yes! We offer in-person classes at our Accra and Kumasi campuses, fully online classes via our digital platform, and hybrid options so you can mix both based on your schedule.',
      },
      {
        q: 'What is the maximum class size?',
        a: 'We keep classes small — a maximum of 12 students per group — to ensure every student gets personalised attention and faster progress.',
      },
      {
        q: 'Do you prepare students for official German exams?',
        a: 'Absolutely. We provide dedicated exam preparation for Goethe-Institut and telc certifications. Our students enjoy a 95% pass rate on these internationally recognised exams.',
      },
    ],
  },
  {
    category: 'Fees & Enrolment',
    icon: 'ri-money-dollar-circle-line',
    questions: [
      {
        q: 'How much do the courses cost?',
        a: 'Course fees vary by level and format. Group courses start from GHS 1,200 per level, while Private Lessons are priced per session. Check our Pricing section for the full breakdown or book a free consultation for a personalised quote.',
      },
      {
        q: 'Are there any discounts or payment plans available?',
        a: 'Yes. We offer early-bird discounts, sibling discounts, and flexible instalment payment plans. Contact us or book a free consultation to learn about current promotions.',
      },
      {
        q: 'What is included in the course fee?',
        a: 'Your fee covers all learning materials, access to our digital learning platform, mock tests, and a certificate of completion. Exam registration fees for Goethe or telc are separate.',
      },
      {
        q: 'How do I enrol in a course?',
        a: 'You can enrol by filling out the Book Free Consultation form on this page, calling us directly, or visiting any of our campuses. Our team will guide you through the placement test and registration process.',
      },
    ],
  },
  {
    category: 'Visa Support',
    icon: 'ri-passport-line',
    questions: [
      {
        q: 'Do you help with German student visa applications?',
        a: 'Yes. Our dedicated visa consultation team provides end-to-end support — from document preparation and application guidance to interview coaching and follow-up with the German Embassy.',
      },
      {
        q: 'What is your visa success rate?',
        a: 'We are proud of a 98% visa success rate for students who complete our full visa consultation programme. Our experienced advisors know exactly what the German Embassy requires.',
      },
      {
        q: 'Do I need to reach a certain language level before applying for a visa?',
        a: 'For most German student visas, a minimum of A1 or A2 is required. For work or study visas, B1 or B2 may be needed. Our advisors will assess your situation and recommend the right path.',
      },
      {
        q: 'Is visa consultation included in the course fee?',
        a: 'Visa consultation is a separate service. However, students enrolled in our courses receive a discounted rate on visa support packages. Book a free consultation to get full details.',
      },
      {
        q: 'Can I get visa support even if I am not enrolled in a course?',
        a: 'Yes. We offer standalone visa consultation services to anyone planning to travel, study, or work in Germany — even if you are not currently taking a language course with us.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
        open ? 'border-[#0F6B3E] bg-white shadow-md' : 'border-[#E5EDE0] bg-white hover:border-[#0F6B3E]/40 hover:shadow-sm'
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <span className={`font-['Poppins'] font-semibold text-sm md:text-base leading-snug transition-colors duration-200 ${open ? 'text-[#0F6B3E]' : 'text-[#1E1E1E]'}`}>
          {q}
        </span>
        <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${open ? 'bg-[#0F6B3E] text-white rotate-45' : 'bg-[#F0F7EC] text-[#0F6B3E]'}`}>
          <i className="ri-add-line text-lg"></i>
        </span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-6 pb-5 text-[#1E1E1E]/70 text-sm md:text-base leading-relaxed border-t border-[#E5EDE0] pt-4">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollAnimation();

  return (
    <section id="faq" className="py-24 bg-[#F6F9F3] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7F000]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0F6B3E]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-block bg-[#0F6B3E]/10 text-[#0F6B3E] px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
            Got Questions?
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
            Frequently Asked <span className="text-[#0F6B3E]">Questions</span>
          </h2>
          <p className="text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto">
            Everything you need to know about our courses, fees, and visa support — answered clearly and honestly.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {faqs.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeCategory === i
                  ? 'bg-[#0F6B3E] text-white shadow-lg shadow-[#0F6B3E]/30'
                  : 'bg-white text-[#1E1E1E]/70 border border-[#E5EDE0] hover:border-[#0F6B3E]/40 hover:text-[#0F6B3E]'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className={`${cat.icon} text-sm`}></i>
              </span>
              {cat.category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div
          ref={bodyRef as React.RefObject<HTMLDivElement>}
          className={`space-y-3 transition-all duration-700 ${bodyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {faqs[activeCategory].questions.map((item, i) => (
            <FAQItem key={`${activeCategory}-${i}`} q={item.q} a={item.a} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] rounded-3xl p-10">
          <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full mx-auto mb-4">
            <i className="ri-question-answer-line text-2xl text-white"></i>
          </div>
          <h3 className="font-['Poppins'] text-2xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Our team is happy to help. Book a free consultation and we'll answer everything personally.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('consultation-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-[#C7F000] text-[#0F6B3E] font-bold px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-calendar-check-line text-base"></i>
            </span>
            Book Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
