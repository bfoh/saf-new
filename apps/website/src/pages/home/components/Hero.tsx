import { useEffect, useRef, useState } from 'react';

/* ── Count-Up Number Component ── */
function CountUp({
  target,
  suffix = '',
  duration = 1800,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease-out
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ── Trust Badge ── */
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg border border-white/60 hover:scale-105 transition-transform duration-200">
      <i className={`${icon} text-[#0F6B3E] text-lg`}></i>
      <span className="text-sm font-semibold text-[#1E1E1E] whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://readdy.ai/api/search-image?query=Modern%20minimalist%20educational%20environment%20with%20soft%20natural%20lighting%2C%20young%20diverse%20African%20students%20studying%20German%20language%20in%20a%20contemporary%20classroom%20with%20wooden%20desks%20and%20green%20plants%2C%20warm%20atmosphere%2C%20professional%20photography%2C%20shallow%20depth%20of%20field%2C%20natural%20window%20light%2C%20clean%20aesthetic%2C%20inspirational%20learning%20space&width=1920&height=1080&seq=hero-bg-saf-001&orientation=landscape"
          alt="SAF Institute Learning Environment"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/45 to-[#0F6B3E]/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Animated ambient blobs */}
      <div className="absolute top-24 right-8 w-80 h-80 bg-[#C7F000]/15 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-24 left-8 w-96 h-96 bg-[#0F6B3E]/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4CAF50]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-dot-grid-white opacity-30 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 py-20 w-full">
        <div className="text-center max-w-4xl mx-auto">

          {/* Trust Badges */}
          <div
            className={`flex flex-wrap items-center justify-center gap-3 mb-10 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <TrustBadge icon="ri-global-line" label="Online & In-Person" />
            <TrustBadge icon="ri-user-star-line" label="1-on-1 Coaching" />
            <TrustBadge icon="ri-passport-line" label="Visa Consultation" />
            <TrustBadge icon="ri-team-line" label="Max 12 Students" />
          </div>

          {/* Eyebrow label */}
          <div
            className={`transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <span className="inline-flex items-center gap-2 bg-[#C7F000]/20 border border-[#C7F000]/40 backdrop-blur-sm text-[#C7F000] text-sm font-semibold px-5 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C7F000] animate-pulse inline-block"></span>
              Ghana's #1 German Language Institute
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`font-['Poppins'] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            Open the Door to Germany.
            <br />
            <span className="relative inline-block">
              <span className="text-[#C7F000] drop-shadow-lg">Start Speaking German</span>
            </span>{' '}
            <span className="text-white/95">With Confidence.</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-base sm:text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-3xl mx-auto transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Learn German in Ghana with expert instructors and structured courses designed to prepare you for study, work, and travel opportunities in Germany.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <a
              href="#courses"
              className="relative overflow-hidden group bg-[#0F6B3E] text-white px-9 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#0d5a33] transition-all duration-300 shadow-2xl hover:shadow-[#0F6B3E]/60 hover:scale-105 whitespace-nowrap w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <i className="ri-book-open-line text-lg"></i>
              Start Learning German
              <span className="absolute inset-0 animate-shimmer rounded-full pointer-events-none"></span>
            </a>
            <a
              href="#contact"
              className="group bg-white/15 border-2 border-white/50 backdrop-blur-sm text-white px-9 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-white hover:text-[#0F6B3E] transition-all duration-300 shadow-xl hover:scale-105 whitespace-nowrap w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <i className="ri-calendar-check-line text-lg"></i>
              Book Free Consultation
            </a>
          </div>

          {/* Social Proof Stats */}
          <div
            className={`flex flex-wrap items-center justify-center gap-6 md:gap-14 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {[
              { target: 500, suffix: '+', label: 'Happy Students', icon: 'ri-group-line' },
              { target: 95, suffix: '%', label: 'Exam Success Rate', icon: 'ri-medal-line' },
              { target: 98, suffix: '%', label: 'Visa Success Rate', icon: 'ri-passport-line' },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center group"
              >
                <div className="flex items-end justify-center gap-1">
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#C7F000] font-['Poppins'] leading-none drop-shadow-lg tabular-nums">
                    <CountUp target={stat.target} suffix={stat.suffix} duration={1600 + i * 200} />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <i className={`${stat.icon} text-white/60 text-sm`}></i>
                  <div className="text-white/80 text-sm font-medium whitespace-nowrap">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
        <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce mt-0.5"></div>
        </div>
      </div>
    </section>
  );
}
