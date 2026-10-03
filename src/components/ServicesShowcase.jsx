import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ServicesShowcase.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesShowcase() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isAnimatingRef = useRef(false);
  const activeIndexRef = useRef(0);
  const wheelDeltaAccumulator = useRef(0);

  // Keep activeIndexRef synchronized with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Initial check if section is already in viewport on mount
  useEffect(() => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
      if (inView) {
        setIsInViewport(true);
      }
    }
  }, []);

  const services = [
    {
      id: 'affiliate',
      title: 'Affiliate Marketing',
      subtitle: 'Performance-driven affiliate programs that help you acquire quality customers and scale faster.',
      bgImage: '/image/Home/section2/am1.png',
      activeDotIndex: 0,
    },
    {
      id: 'email-sms',
      title: 'Email & SMS',
      subtitle: 'Reach your audience instantly with targeted email and SMS campaigns that drive real engagement.',
      bgImage: '/image/Home/section2/email.png',
      activeDotIndex: 1,
    },
    {
      id: 'list-management',
      title: 'List Management',
      subtitle: 'Reach your audience instantly with targeted email and SMS campaigns that drive real engagement.',
      bgImage: '/image/Home/section2/list management.png',
      activeDotIndex: 2,
    },
    {
      id: 'crm',
      title: 'CRM Consultation',
      subtitle: 'Reach your audience instantly with targeted email and SMS campaigns that drive real engagement.',
      bgImage: '/image/Home/section2/crm1.png',
      activeDotIndex: 3,
    },
    {
      id: 'web-dev',
      title: 'Web Development',
      subtitle: 'Reach your audience instantly with targeted email and SMS campaigns that drive real engagement.',
      bgImage: '/image/Home/section2/webdevelopment.png',
      activeDotIndex: 4,
    },
    {
      id: 'smm',
      title: 'SMM',
      subtitle: 'Reach your audience instantly with targeted email and SMS campaigns that drive real engagement.',
      bgImage: '/image/Home/section2/smm1.png',
      activeDotIndex: 5,
    },
  ];

  // Controlled service transition function (Locks out rapid skipping)
  const goToService = useCallback((nextIndex) => {
    if (isAnimatingRef.current) return;
    if (nextIndex < 0 || nextIndex >= services.length) return;
    if (nextIndex === activeIndexRef.current) return;

    isAnimatingRef.current = true;
    setActiveIndex(nextIndex);
    setProgress(0);

    // Lock transition for 0.7 seconds to ensure smooth animation without skipping
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 700);
  }, [services.length]);

  // GSAP ScrollTrigger: Pin section during scroll interaction & track section viewport entry/exit for autoplay
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Pin section trigger for interactive stepped card scrolling
      ScrollTrigger.create({
        id: 'services-pin',
        trigger: section,
        start: 'top top+=80',
        end: '+=400',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          if (!self.isActive) {
            wheelDeltaAccumulator.current = 0;
          }
        },
      });

      // 2. Section Viewport Trigger: Autoplay starts ONLY when section enters viewport, pauses when leaving
      ScrollTrigger.create({
        id: 'services-viewport',
        trigger: section,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter: () => setIsInViewport(true),
        onLeave: () => setIsInViewport(false),
        onEnterBack: () => setIsInViewport(true),
        onLeaveBack: () => setIsInViewport(false),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [services.length]);

  // Stepped Mouse Wheel Scroll Control: Prevents fast wheel from skipping cards + Immediate boundary release
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleWheel = (e) => {
      const st = ScrollTrigger.getById('services-pin');
      if (!st || !st.isActive) {
        wheelDeltaAccumulator.current = 0;
        return;
      }

      const currentIdx = activeIndexRef.current;

      // 1. Boundary Release DOWN: On last service card + scrolling DOWN -> DO NOT prevent default! Immediately exit pinned section!
      if (currentIdx === services.length - 1 && e.deltaY > 0) {
        return;
      }

      // 2. Boundary Release UP: On first service card + scrolling UP -> DO NOT prevent default! Immediately exit pinned section upward!
      if (currentIdx === 0 && e.deltaY < 0) {
        return;
      }

      // Intercept wheel scroll to step through services one by one
      e.preventDefault();

      if (isAnimatingRef.current) return;

      wheelDeltaAccumulator.current += e.deltaY;
      const threshold = 55; // Debounce threshold in px

      if (wheelDeltaAccumulator.current >= threshold) {
        wheelDeltaAccumulator.current = 0;
        if (currentIdx < services.length - 1) {
          goToService(currentIdx + 1);
        }
      } else if (wheelDeltaAccumulator.current <= -threshold) {
        wheelDeltaAccumulator.current = 0;
        if (currentIdx > 0) {
          goToService(currentIdx - 1);
        }
      }
    };

    sectionEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      sectionEl.removeEventListener('wheel', handleWheel);
    };
  }, [services.length, goToService]);

  // Touch / Mobile Swipe Handling (Stepped + Boundary Release)
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const st = ScrollTrigger.getById('services-pin');
      if (!st || !st.isActive) return;

      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;
      const currentIdx = activeIndexRef.current;

      if (currentIdx === services.length - 1 && deltaY > 0) return;
      if (currentIdx === 0 && deltaY < 0) return;

      e.preventDefault();

      if (isAnimatingRef.current) return;

      if (Math.abs(deltaY) > 45) {
        if (deltaY > 0 && currentIdx < services.length - 1) {
          goToService(currentIdx + 1);
          touchStartY = touchCurrentY;
        } else if (deltaY < 0 && currentIdx > 0) {
          goToService(currentIdx - 1);
          touchStartY = touchCurrentY;
        }
      }
    };

    sectionEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    sectionEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      sectionEl.removeEventListener('touchstart', handleTouchStart);
      sectionEl.removeEventListener('touchmove', handleTouchMove);
    };
  }, [services.length, goToService]);

  // Autoplay Mode: Cycles cards automatically when idle AND section is in viewport (paused outside viewport or on hover)
  useEffect(() => {
    if (!isInViewport || shouldReduceMotion) return;

    const cycleDuration = 3500; // 3.5 seconds per service card
    const intervalTime = 40;
    const step = (intervalTime / cycleDuration) * 100;

    const timer = setInterval(() => {
      if (!isHovered) {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveIndex((prevIdx) => (prevIdx + 1) % services.length);
            return 0;
          }
          return prev + step;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isInViewport, shouldReduceMotion, isHovered, services.length]);

  const handleDotClick = (index) => {
    goToService(index);
  };

  const safeIndex = (typeof activeIndex === 'number' && !isNaN(activeIndex))
    ? Math.min(services.length - 1, Math.max(0, activeIndex))
    : 0;

  // Calculate synchronized continuous line progress between dots (0% to 100%)
  const totalSegments = services.length - 1; // 5 segments between 6 dots
  const lineProgressPercent = safeIndex >= totalSegments
    ? 100
    : Math.min(100, Math.max(0, ((safeIndex + Math.min(progress, 100) / 100) / totalSegments) * 100));

  const currentService = services[safeIndex] || services[0];

  return (
    <section 
      id="services"
      ref={sectionRef} 
      className="relative bg-[#FDFBF7] bg-repeat bg-center w-full py-4 lg:py-6 my-0 lg:min-h-[calc(100dvh-var(--header-height,76px))] flex items-center justify-center box-border"
      style={{ 
        backgroundImage: "url('/image/Home/section2/background.png')",
        backgroundSize: '600px auto',
      }}
    >
      <div 
        className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-1"
      >
        <motion.div
          ref={cardRef}
          key="master-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="service-card w-full bg-[#FFFDF9] rounded-[2.5rem] lg:rounded-[3rem] px-6 sm:px-10 lg:px-12 py-6 sm:py-8 lg:py-9 border border-slate-100 shadow-xl relative overflow-hidden transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Artwork Image + Overlaid White Service Card with Motion Transition */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-2 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentService.id}
                  initial={{ opacity: 0, scale: 0.96, y: 25, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -25, rotate: 2 }}
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                  className={`service-art relative flex items-center justify-center w-full max-w-[480px] ${({ 'list-management': styles.listManagement, crm: styles.crmConsultation, 'web-dev': styles.webDevelopment, smm: styles.smm })[currentService.id] || ''}`}
                >
                  {/* 1. Large Artwork Image */}
                  <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] max-h-[48vh] rounded-[2.2rem] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src={currentService.bgImage}
                      alt={currentService.title}
                      className="w-full h-full object-cover select-none"
                    />
                  </div>

                  {/* 2. White Card Overlaid Exactly Like Reference */}
                  <div className="service-caption absolute bottom-2 sm:bottom-4 left-4 sm:left-6 z-20 w-[85%] sm:w-[80%] max-w-[340px] bg-white rounded-[1.8rem] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-2">
                      {currentService.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                      {currentService.subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Center Column: Delicate Vertical Dashed Line Divider with 6 Interactive Node Dots */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center relative py-6 min-h-[320px]">
              {/* Vertical Dashed Line with Animated Green Progress Layer */}
              <div className="absolute top-4 bottom-4 w-[2px] pointer-events-none">
                {/* 1. Base Grey Dashed Line */}
                <div className="absolute inset-0 w-full border-l-2 border-dashed border-slate-300" />

                {/* 2. Green Progress Layer filling from top to bottom over the dashed line */}
                <div
                  className="absolute top-0 left-0 w-full overflow-hidden"
                  style={{
                    height: `${lineProgressPercent}%`,
                    transition: safeIndex === 0 && progress < 4 ? 'none' : 'height 75ms linear',
                  }}
                >
                  <div className="w-[2px] h-[600px] border-l-2 border-dashed border-[#10B981]" />
                </div>
              </div>

              {/* 6 Circular Node Dots matching reference 1:1 with Progress Fill Animation */}
              <div className="relative z-10 flex flex-col items-center justify-between space-y-6">
                {services.map((service, dotIdx) => {
                  const isCompleted = dotIdx < safeIndex;
                  const isActive = dotIdx === safeIndex;

                  return (
                    <button
                      key={service.id}
                      onClick={() => handleDotClick(dotIdx)}
                      className="flex items-center justify-center relative focus:outline-none group/dot cursor-pointer"
                      title={service.title}
                      aria-label={`Go to ${service.title}`}
                    >
                      {isActive ? (
                        <div className="relative flex items-center justify-center">
                          {/* Animated SVG Progress Ring */}
                          <svg className="w-6 h-6 -rotate-90 transform" viewBox="0 0 24 24">
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="#E2E8F0"
                              strokeWidth="2.5"
                              fill="none"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="#10B981"
                              strokeWidth="2.5"
                              fill="none"
                              strokeDasharray="56.54"
                              strokeDashoffset={56.54 - (56.54 * Math.min(progress, 100)) / 100}
                              strokeLinecap="round"
                              className="transition-all duration-75 ease-linear"
                            />
                          </svg>
                          <div className="absolute w-3 h-3 rounded-full bg-[#10B981] shadow-md" />
                        </div>
                      ) : isCompleted ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#10B981] shadow-sm transition-all duration-300" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300 group-hover/dot:border-emerald-400 transition-colors" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Heading & Subtitle matching reference 1:1 */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4 pl-0 lg:pl-6 text-center lg:text-left">
              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1C3E] tracking-tight leading-[1.12]">
                What We Can <br className="hidden sm:inline" />
                Do For You?
              </h2>

              {/* Supporting Subtitle Text */}
              <div className="space-y-1 text-slate-600 font-normal text-sm sm:text-base lg:text-lg leading-relaxed">
                <p>One Partner. Multiple Solutions.</p>
                <p>Built Around Your Goals.</p>
              </div>

              {/* Mobile Dots Bar for Mobile & Tablet screens */}
              <div className="flex lg:hidden justify-center items-center gap-3 pt-4">
                {services.map((service, dotIdx) => {
                  const isCompleted = dotIdx < safeIndex;
                  const isActive = dotIdx === safeIndex;

                  return (
                    <button
                      key={service.id}
                      onClick={() => handleDotClick(dotIdx)}
                      className="p-1 focus:outline-none"
                      aria-label={`Go to ${service.title}`}
                    >
                      {isActive ? (
                        <div className="w-6 h-2.5 rounded-full bg-[#10B981] transition-all duration-300" />
                      ) : isCompleted ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/70 transition-all duration-300" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 transition-colors" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
