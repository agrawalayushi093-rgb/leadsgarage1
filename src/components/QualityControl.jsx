import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function QualityControl() {
  const slides = [
    { id: 0, src: '/image/Home/Group 39995.png', alt: 'Propensity Score Phone Screen' },
    { id: 1, src: '/image/Home/Group 39999.png', alt: 'Verified 100% Clean Phone Screen' },
    { id: 2, src: '/image/Home/Group 39996.png', alt: 'Propensity Score Phone Screen Right' },
  ];

  const [[activeSlide, direction], setSlideState] = useState([1, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSlideChange = useCallback((newIndex, customDirection) => {
    setSlideState(([current]) => {
      if (newIndex === current) return [current, 0];
      const dir = customDirection !== undefined
        ? customDirection
        : newIndex > current ? 1 : -1;
      return [newIndex, dir];
    });
  }, []);

  // Autoplay timer: Automatically cycles cards every 3.5 seconds (Pauses on hover)
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setSlideState(([curr]) => [(curr + 1) % slides.length, 1]);
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const leftSlideIndex = (activeSlide + slides.length - 1) % slides.length;
  const centerSlideIndex = activeSlide;
  const rightSlideIndex = (activeSlide + 1) % slides.length;

  const leftSlide = slides[leftSlideIndex];
  const centerSlide = slides[centerSlideIndex];
  const rightSlide = slides[rightSlideIndex];

  // Center slot variants: smooth directional slide + clean crossfade
  const centerVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir >= 0 ? 55 : -55,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir >= 0 ? -55 : 55,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Left slot variants
  const leftVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir >= 0 ? 45 : -45,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir >= 0 ? -45 : 45,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Right slot variants
  const rightVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir >= 0 ? 45 : -45,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir >= 0 ? -45 : 45,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section id="quality" className="py-16 sm:py-20 lg:py-28 bg-transparent relative overflow-hidden w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Header */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Why We Deliver Better Results
          </h2>

          {/* Horizontal Dashed Line with 3 Center Dots Matching 3 Cards 1:1 */}
          <div className="relative flex items-center justify-center my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="w-full border-t border-dashed border-slate-300"></div>
            </div>

            <div className="relative z-10 bg-[#FDFBF7] px-6 flex items-center gap-4">
              {slides.map((_, idx) => {
                const isActive = activeSlide === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSlideChange(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${
                      isActive
                        ? 'w-4 h-4 bg-[#00E599] ring-4 ring-emerald-100 shadow-md scale-110'
                        : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to card slide ${idx + 1}`}
                    aria-current={isActive ? 'step' : undefined}
                  />
                );
              })}
            </div>
          </div>

          {/* Sub Title & Description */}
          <div className="space-y-3 mb-10 sm:mb-14">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Quality Control
            </h3>
            <p className="text-sm sm:text-base text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
              Premium placements with every impression protected from bots, unsafe content, and domain-arbitrage traffic.
            </p>
          </div>
        </div>

        {/* 3 Blue Phone Screens Visual Display with Autoplay & Smooth Motion Transition */}
        <div
          id="quality-slide-display"
          aria-label={`Card slide ${activeSlide + 1} of ${slides.length}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="quality-phones relative w-full max-w-[1100px] mx-auto flex justify-center items-center py-6 sm:py-10 px-2 min-h-[380px] sm:min-h-[500px]"
        >
          {/* Left Phone Screen Slot */}
          <div
            className="quality-slot quality-slot-left"
            onClick={() => handleSlideChange(leftSlideIndex, -1)}
            role="button"
            tabIndex={0}
            aria-label={`Switch to ${leftSlide.alt}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSlideChange(leftSlideIndex, -1);
              }
            }}
          >
            <div className="relative w-full aspect-[369/649] flex items-center justify-center overflow-visible">
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={`left-${leftSlide.id}`}
                  custom={direction}
                  variants={leftVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={leftSlide.src}
                    alt={leftSlide.alt}
                    style={{ aspectRatio: '369 / 649' }}
                    className="w-full h-auto object-contain drop-shadow-xl select-none"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Center Phone Screen Slot (Main / Highlighted) */}
          <div className="quality-slot quality-slot-center">
            <div className="relative w-full aspect-[427/749] flex items-center justify-center overflow-visible">
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={`center-${centerSlide.id}`}
                  custom={direction}
                  variants={centerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={centerSlide.src}
                    alt={centerSlide.alt}
                    style={{ aspectRatio: '427 / 749' }}
                    className="w-full h-auto object-contain drop-shadow-2xl select-none"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Phone Screen Slot */}
          <div
            className="quality-slot quality-slot-right"
            onClick={() => handleSlideChange(rightSlideIndex, 1)}
            role="button"
            tabIndex={0}
            aria-label={`Switch to ${rightSlide.alt}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSlideChange(rightSlideIndex, 1);
              }
            }}
          >
            <div className="relative w-full aspect-[369/649] flex items-center justify-center overflow-visible">
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={`right-${rightSlide.id}`}
                  custom={direction}
                  variants={rightVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={rightSlide.src}
                    alt={rightSlide.alt}
                    style={{ aspectRatio: '369 / 649' }}
                    className="w-full h-auto object-contain drop-shadow-xl select-none"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
