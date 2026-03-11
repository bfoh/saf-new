import { useState, useRef } from 'react';
import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

const PLANS = [
  {
    level: 'A1',
    title: 'Beginner',
    subtitle: 'Perfect for absolute beginners',
    price: 850,
    duration: '8 weeks',
    sessions: '24 sessions',
    hours: '48 hours total',
    badge: null,
    color: 'from-[#4CAF50] to-[#81C784]',
    features: [
      'Alphabet & pronunciation',
      'Basic greetings & introductions',
      'Numbers, dates & time',
      'Simple everyday conversations',
      'Course materials included',
      'Online practice portal access',
    ],
    cta: 'Enrol in A1',
  },
  {
    level: 'A2',
    title: 'Elementary',
    subtitle: 'Build on your foundations',
    price: 900,
    duration: '8 weeks',
    sessions: '24 sessions',
    hours: '48 hours total',
    badge: null,
    color: 'from-[#0F6B3E] to-[#4CAF50]',
    features: [
      'Expanded vocabulary & grammar',
      'Shopping, travel & social topics',
      'Reading & writing practice',
      'Listening comprehension drills',
      'Course materials included',
      'Online practice portal access',
    ],
    cta: 'Enrol in A2',
  },
  {
    level: 'B1',
    title: 'Intermediate',
    subtitle: 'Most popular — exam-ready',
    price: 1050,
    duration: '10 weeks',
    sessions: '30 sessions',
    hours: '60 hours total',
    badge: 'Most Popular',
    color: 'from-[#0F6B3E] to-[#1a8a52]',
    features: [
      'Complex grammar structures',
      'Work & study vocabulary',
      'Goethe B1 exam preparation',
      'Mock exam sessions included',
      'Course materials included',
      'Priority tutor support',
    ],
    cta: 'Enrol in B1',
  },
  {
    level: 'B2',
    title: 'Advanced',
    subtitle: 'Fluency for work & study',
    price: 1200,
    duration: '12 weeks',
    sessions: '36 sessions',
    hours: '72 hours total',
    badge: null,
    color: 'from-[#1E1E1E] to-[#3a3a3a]',
    features: [
      'Advanced grammar & writing',
      'Academic & professional German',
      'Goethe B2 exam preparation',
      'Mock exam sessions included',
      'Course materials included',
      'Priority tutor support',
    ],
    cta: 'Enrol in B2',
  },
  {
    level: '1:1',
    title: 'Private Lessons',
    subtitle: 'Fully personalised coaching',
    price: 120,
    priceNote: 'per session',
    duration: 'Flexible schedule',
    sessions: 'Min. 5 sessions',
    hours: '2 hrs per session',
    badge: 'Premium',
    color: 'from-[#C7F000] to-[#a8cc00]',
    textDark: true,
    features: [
      'Custom curriculum for your goals',
      'Choose your own schedule',
      'Any level — A1 through C1',
      'Visa interview preparation',
      'Dedicated native-speaker tutor',
      'Unlimited WhatsApp support',
    ],
    cta: 'Book Private Lessons',
  },
];

const COURSES_FOR_FORM = [
  'A1 – Beginner',
  'A2 – Elementary',
  'B1 – Intermediate',
  'B2 – Advanced',
  'Private Lessons',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function PricingTable() {
  const [modalCourse, setModalCourse] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, visibleItems } = useStaggerAnimation(PLANS.length);

  const openModal = (course: string) => {
    setModalCourse(course);
    setStatus('idle');
    setCharCount(0);
  };

  const closeModal = () => {
    setModalCourse(null);
    setStatus('idle');
    formRef.current?.reset();
    setCharCount(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const data = new URLSearchParams();
    data.append('name', (form.elements.namedItem('name') as HTMLInputElement).value);
    data.append('email', (form.elements.namedItem('email') as HTMLInputElement).value);
    data.append('phone', (form.elements.namedItem('phone') as HTMLInputElement).value);
    data.append('course', (form.elements.namedItem('course') as HTMLSelectElement).value);
    data.append('message', (form.elements.namedItem('message') as HTMLTextAreaElement).value);

    try {
      const res = await fetch('https://readdy.ai/api/form/d6mc6go5dsf7sr1n69g0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      if (res.ok) {
        setStatus('success');
        formRef.current?.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7F000]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0F6B3E]/8 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div
            ref={headerRef as React.RefObject<HTMLDivElement>}
            className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="inline-block bg-[#C7F000]/20 text-[#0F6B3E] px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
              Transparent Pricing
            </div>
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
              Course Fees &amp; <span className="text-[#0F6B3E]">Enrolment</span>
            </h2>
            <p className="text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto">
              All prices are in Ghana Cedis (GHS). No hidden fees — what you see is what you pay. Materials are included in every group course.
            </p>
          </div>

          {/* Pricing Cards */}
          <div
            ref={gridRef as React.RefObject<HTMLDivElement>}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch"
          >
            {PLANS.map((plan, index) => (
              <div
                key={plan.level}
                className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${plan.badge === 'Most Popular'
                    ? 'border-[#0F6B3E] shadow-xl shadow-[#0F6B3E]/15'
                    : 'border-[#1E1E1E]/8 shadow-md'
                  } ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap z-10 ${plan.badge === 'Most Popular'
                      ? 'bg-[#C7F000] text-[#0F6B3E]'
                      : 'bg-[#1E1E1E] text-white'
                    }`}>
                    {plan.badge}
                  </div>
                )}

                {/* Card Header */}
                <div className={`bg-gradient-to-br ${plan.color} p-6 pb-8`}>
                  <div className={`text-4xl font-black font-['Poppins'] mb-1 ${plan.textDark ? 'text-[#1E1E1E]' : 'text-white'}`}>
                    {plan.level}
                  </div>
                  <div className={`text-lg font-bold font-['Poppins'] ${plan.textDark ? 'text-[#1E1E1E]' : 'text-white'}`}>
                    {plan.title}
                  </div>
                  <div className={`text-sm mt-1 ${plan.textDark ? 'text-[#1E1E1E]/70' : 'text-white/80'}`}>
                    {plan.subtitle}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-[#F6F9F3] px-6 py-5 border-b border-[#1E1E1E]/6">
                  <div className="flex items-end gap-1">
                    <span className="text-sm font-semibold text-[#0F6B3E] mt-1">GHS</span>
                    <span className="text-4xl font-black text-[#1E1E1E] font-['Poppins'] leading-none">
                      {plan.price.toLocaleString()}
                    </span>
                    {plan.priceNote && (
                      <span className="text-sm text-[#1E1E1E]/50 mb-1">{plan.priceNote}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                    <span className="flex items-center gap-1 text-xs text-[#1E1E1E]/60 whitespace-nowrap">
                      <i className="ri-time-line text-[#0F6B3E]"></i> {plan.duration}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#1E1E1E]/60 whitespace-nowrap">
                      <i className="ri-calendar-line text-[#0F6B3E]"></i> {plan.sessions}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#1E1E1E]/60 whitespace-nowrap">
                      <i className="ri-book-open-line text-[#0F6B3E]"></i> {plan.hours}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 bg-white px-6 py-5">
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#1E1E1E]/75">
                        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="ri-check-line text-[#0F6B3E] font-bold"></i>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="bg-white px-6 pb-6 pt-2">
                  <button
                    onClick={() => openModal(
                      COURSES_FOR_FORM.find(c => c.startsWith(plan.level === '1:1' ? 'Private' : plan.level)) ?? plan.title
                    )}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap ${plan.badge === 'Most Popular'
                        ? 'bg-gradient-to-r from-[#0F6B3E] to-[#4CAF50] text-white shadow-lg shadow-[#0F6B3E]/25'
                        : plan.textDark
                          ? 'bg-[#1E1E1E] text-white hover:bg-[#333]'
                          : 'bg-[#F6F9F3] text-[#0F6B3E] border border-[#0F6B3E]/20 hover:bg-[#0F6B3E] hover:text-white'
                      }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div
            className={`mt-12 text-center transition-all duration-700 delay-500 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <p className="text-sm text-[#1E1E1E]/50">
              <i className="ri-information-line mr-1"></i>
              Prices are subject to change. Instalment payment plans available — ask us during your free consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Enrolment Modal */}
      {modalCourse && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F6B3E] to-[#4CAF50] p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-['Poppins'] text-xl font-bold text-white">Enrol Now</h3>
                  <p className="text-white/80 text-sm mt-0.5">Complete your details to secure your spot</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-10 gap-4">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#C7F000]/20">
                    <i className="ri-checkbox-circle-fill text-5xl text-[#0F6B3E]"></i>
                  </div>
                  <h4 className="font-['Poppins'] text-2xl font-bold text-[#1E1E1E]">Enrolment Received!</h4>
                  <p className="text-[#1E1E1E]/60 max-w-xs text-sm leading-relaxed">
                    Thank you! Our team will contact you within 24 hours to confirm your enrolment and share payment details.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-2 bg-[#0F6B3E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0a5530] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  data-readdy-form
                  id="course-enrolment"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#0F6B3E]/50">
                        <i className="ri-user-line text-base"></i>
                      </span>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Kwame Mensah"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1E1E1E]/10 bg-[#F6F9F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/30 focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/30 focus:border-[#0F6B3E] transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#0F6B3E]/50">
                        <i className="ri-mail-line text-base"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1E1E1E]/10 bg-[#F6F9F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/30 focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/30 focus:border-[#0F6B3E] transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#0F6B3E]/50">
                        <i className="ri-phone-line text-base"></i>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+233 XX XXX XXXX"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1E1E1E]/10 bg-[#F6F9F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/30 focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/30 focus:border-[#0F6B3E] transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">
                      Course <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#0F6B3E]/50 pointer-events-none">
                        <i className="ri-book-open-line text-base"></i>
                      </span>
                      <select
                        name="course"
                        required
                        defaultValue={modalCourse}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#1E1E1E]/10 bg-[#F6F9F3] text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/30 focus:border-[#0F6B3E] transition-all duration-200 appearance-none cursor-pointer"
                      >
                        {COURSES_FOR_FORM.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#0F6B3E]/50 pointer-events-none">
                        <i className="ri-arrow-down-s-line text-base"></i>
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">
                      Additional Notes <span className="text-[#1E1E1E]/30 font-normal">(optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      maxLength={500}
                      placeholder="Any questions or special requirements…"
                      onChange={(e) => setCharCount(e.target.value.length)}
                      className="w-full px-4 py-3 rounded-xl border border-[#1E1E1E]/10 bg-[#F6F9F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/30 focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/30 focus:border-[#0F6B3E] transition-all duration-200 resize-none"
                    ></textarea>
                    <p className="text-xs text-right text-[#1E1E1E]/30 mt-1">{charCount}/500</p>
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-500 flex items-center gap-1.5">
                      <i className="ri-error-warning-line"></i>
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-gradient-to-r from-[#0F6B3E] to-[#4CAF50] text-white font-semibold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#0F6B3E]/20 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap disabled:opacity-60"
                  >
                    {status === 'submitting' ? (
                      <>
                        <i className="ri-loader-4-line animate-spin text-lg"></i>
                        Submitting…
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line text-lg"></i>
                        Submit Enrolment
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-[#1E1E1E]/40">
                    Our team will confirm your spot and share payment details within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
