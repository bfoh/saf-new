import { useState, useRef } from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const COURSES = [
  'A1 – Beginner',
  'A2 – Elementary',
  'B1 – Intermediate',
  'B2 – Advanced',
  'Private Lessons',
  'Visa Consultation',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ConsultationForm() {
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation();

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
      const res = await fetch('https://readdy.ai/api/form/d6mc4mp4a3uojp5fgmf0', {
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
    <section id="consultation-form" className="py-24 bg-[#F6F9F3] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#C7F000]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div
          ref={sectionRef as React.RefObject<HTMLDivElement>}
          className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Left: Info */}
          <div>
            <div className="inline-block bg-[#C7F000]/20 text-[#0F6B3E] px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
              Free Consultation
            </div>
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-6 leading-tight">
              Take the First Step <br />
              <span className="text-[#0F6B3E]">Towards Germany</span>
            </h2>
            <p className="text-lg text-[#1E1E1E]/70 mb-10 leading-relaxed">
              Book your free consultation today. Our expert advisors will help you choose the right course, plan your learning journey, and guide you through every step toward your German goals.
            </p>

            {/* Benefits */}
            <div className="space-y-5">
              {[
                { icon: 'ri-user-star-line', title: 'Expert Guidance', desc: 'One-on-one session with a certified German language advisor.' },
                { icon: 'ri-road-map-line', title: 'Personalised Plan', desc: 'Get a custom learning roadmap tailored to your goals.' },
                { icon: 'ri-time-line', title: 'No Commitment', desc: 'Completely free with zero obligation to enrol.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0F6B3E] to-[#4CAF50] flex-shrink-0">
                    <i className={`${item.icon} text-xl text-white`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E1E1E] mb-0.5">{item.title}</p>
                    <p className="text-sm text-[#1E1E1E]/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-[#0F6B3E]/10 p-8 md:p-10 border border-[#0F6B3E]/5">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#C7F000]/20 mb-2">
                  <i className="ri-checkbox-circle-fill text-5xl text-[#0F6B3E]"></i>
                </div>
                <h3 className="font-['Poppins'] text-2xl font-bold text-[#1E1E1E]">You're All Set!</h3>
                <p className="text-[#1E1E1E]/60 max-w-xs">
                  Thank you! We've received your request and will be in touch within 24 hours to confirm your free consultation.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 bg-[#0F6B3E] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0a5530] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-['Poppins'] text-2xl font-bold text-[#1E1E1E] mb-2">Book Your Free Session</h3>
                <p className="text-sm text-[#1E1E1E]/50 mb-8">Fill in your details and we'll reach out to schedule your consultation.</p>

                <form
                  ref={formRef}
                  data-readdy-form
                  id="book-free-consultation"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">Full Name <span className="text-red-500">*</span></label>
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
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">Email Address <span className="text-red-500">*</span></label>
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
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#0F6B3E]/50">
                        <i className="ri-phone-line text-base"></i>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+233 XX XXX XXXX"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1E1E1E]/10 bg-[#F6F9F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/30 focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/30 focus:border-[#0F6B3E] transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Preferred Course */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">Preferred Course <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#0F6B3E]/50 pointer-events-none">
                        <i className="ri-book-open-line text-base"></i>
                      </span>
                      <select
                        name="course"
                        required
                        defaultValue=""
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#1E1E1E]/10 bg-[#F6F9F3] text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/30 focus:border-[#0F6B3E] transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select a course…</option>
                        {COURSES.map((c) => (
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
                    <label className="block text-sm font-medium text-[#1E1E1E]/70 mb-1.5">Message <span className="text-[#1E1E1E]/30 font-normal">(optional)</span></label>
                    <textarea
                      name="message"
                      rows={3}
                      maxLength={500}
                      placeholder="Tell us about your goals or any questions you have…"
                      className="w-full px-4 py-3 rounded-xl border border-[#1E1E1E]/10 bg-[#F6F9F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/30 focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/30 focus:border-[#0F6B3E] transition-all duration-200 resize-none"
                    ></textarea>
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
                        <i className="ri-calendar-check-line text-lg"></i>
                        Book My Free Consultation
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-[#1E1E1E]/40">
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
