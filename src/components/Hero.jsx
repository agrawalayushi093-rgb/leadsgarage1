import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';

// ============================================================================
// CAROUSEL SPEED SETTING (Yahan se slide change aur fill hone ki speed set karein)
// Current: 4 seconds
// ============================================================================
const SLIDE_DURATION_SECONDS = 4;
const AUTOPLAY_INTERVAL = SLIDE_DURATION_SECONDS * 1000;
// ============================================================================

const SLIDE_GRADIENTS = {
  0: 'radial-gradient(ellipse at 50% 110%, #4289ff99, transparent 65%)',
  1: 'linear-gradient(#4a0871aa, #a517ff66)',
  2: 'linear-gradient(#007c9466, #00dcf099)',
  3: 'linear-gradient(#00aa6bcc, #00d3a9d9)',
};

const slides = [
  {
    id: 0,
    bgImage: '/image/Home/herosection/blue.png',
    bgColor: 'bg-[#1D4ED8]',
    titlePrefix: 'Get Ready to',
    titleHighlight: 'Grow Business',
    titleHighlightColor: 'text-[#9DFFB2]', // Mint Green
    subtitle: 'Fuel your digital success with a team dedicated to delivering real results.',
    stats: [
      { number: '1.5M+', label: 'Leads Generated' },
      { number: '95%', label: 'Client Satisfaction' },
      { number: '85%', label: 'Conversion Rate' },
      { number: '24/7', label: 'Monitoring' },
    ],
    leftCardImage: '/image/Home/herosection/image 95.png',
    rightCardImage: '/image/Home/herosection/image 97.png',
    topLeftGraphic: null,
    topRightGraphic: '/image/Home/herosection/image 82.png',
    bottomLeftGraphic: '/image/Home/herosection/image 115.png',
    bottomRightGraphic: null,
  },
  {
    id: 1,
    bgImage: '/image/Home/herosection/purple.png',
    bgColor: 'bg-[#7C3AED]',
    titlePrefix: 'Get Ready to',
    titleHighlight: 'Scale with us',
    titleHighlightColor: 'text-[#FEF08A]', // Yellow
    subtitle: 'Fuel your digital success with a team dedicated to delivering real results.',
    stats: [
      { number: '1.5M+', label: 'Leads Generated' },
      { number: '85%', label: 'Conversion Rate' },
      { number: '24/7', label: 'Monitoring' },
      { number: '95%', label: 'Client Satisfaction' },
    ],
    leftCardImage: '/image/Home/herosection/Group 40114.png',
    rightCardImage: '/image/Home/herosection/Group 40112.png',
    topLeftGraphic: '/image/Home/herosection/image 126.png',
    topRightGraphic: '/image/Home/herosection/image 118.png',
    bottomLeftGraphic: null,
    bottomRightGraphic: '/image/Home/herosection/image 127.png',
  },
  {
    id: 2,
    bgImage: '/image/Home/herosection/lblue.png',
    bgColor: 'bg-[#06B6D4]',
    titlePrefix: 'Get Ready to',
    titleHighlight: 'Expand',
    titleHighlightColor: 'text-white',
    subtitle: 'Fuel your digital success with a team dedicated to delivering real results.',
    stats: [
      { number: '1.5M+', label: 'Leads Generated' },
      { number: '85%', label: 'Conversion Rate' },
      { number: '24/7', label: 'Monitoring' },
      { number: '95%', label: 'Client Satisfaction' },
    ],
    leftCardImage: '/image/Home/herosection/image 86.png',
    rightCardImage: '/image/Home/herosection/Group 40102.png',
    topLeftGraphic: '/image/Home/herosection/image 124.png',
    topRightGraphic: null,
    bottomLeftGraphic: '/image/Home/herosection/image 125.png',
    bottomRightGraphic: '/image/Home/herosection/image 120.png',
  },
  {
    id: 3,
    bgImage: '/image/Home/herosection/green.png',
    bgColor: 'bg-[#10B981]',
    titlePrefix: 'Get Ready to',
    titleHighlight: 'Monetize',
    titleHighlightColor: 'text-white',
    subtitle: 'Fuel your digital success with a team dedicated to delivering real results.',
    stats: [
      { number: '1.5M+', label: 'Leads Generated' },
      { number: '85%', label: 'Conversion Rate' },
      { number: '24/7', label: 'Monitoring' },
      { number: '95%', label: 'Client Satisfaction' },
    ],
    leftCardImage: '/image/Home/herosection/image 86.png',
    rightCardImage: '/image/Home/herosection/Group 40102.png',
    topLeftGraphic: '/image/Home/herosection/image 121.png',
    topRightGraphic: '/image/Home/herosection/image 122.png',
    bottomLeftGraphic: null,
    bottomRightGraphic: '/image/Home/herosection/image 123.png',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Preload carousel background and card images to avoid any flash on transition
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.bgImage;
      if (slide.leftCardImage) {
        const lImg = new Image();
        lImg.src = slide.leftCardImage;
      }
      if (slide.rightCardImage) {
        const rImg = new Image();
        rImg.src = slide.rightCardImage;
      }
    });
  }, []);

  // Allow time to read each slide; respect reduced-motion preferences.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setIsInitialMount(false);
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    // If preloader is present on page, wait for it to dismiss (1250ms); otherwise start immediately
    const hasPreloader = typeof document !== 'undefined' && Boolean(document.querySelector('.fixed.z-\\[9999\\]'));
    if (!hasPreloader) {
      setHeroReady(true);
      return;
    }

    const timer = setTimeout(() => {
      setHeroReady(true);
    }, 1250);

    return () => clearTimeout(timer);
  }, []);

  const handleSlideChange = (idx) => {
    if (idx === currentSlide || isTransitioning) return;
    setIsInitialMount(false);
    setIsTransitioning(true);
    setCurrentSlide(idx);
  };

  const activeSlide = slides[currentSlide];

  // Helper for directional entrance and exit of decorative assets with genuine cumulative sequential stagger
  const getDecorationAnimation = (type, position, slideId, orderIndex = 0) => {
    const isSlide3BottomRight = position === styles.bottomRight && slideId === 3;
    const targetRotate = isSlide3BottomRight ? -15 : 0;

    let initialOffset = { x: 0, y: 0 };
    let exitOffset = { x: 0, y: 0 };
    if (!shouldReduceMotion) {
      if (type === 'topLeft') {
        initialOffset = { x: -40, y: -30 };
        exitOffset = { x: -25, y: -20 };
      } else if (type === 'topRight') {
        initialOffset = { x: 40, y: -30 };
        exitOffset = { x: 25, y: -20 };
      } else if (type === 'bottomLeft') {
        initialOffset = { x: -40, y: 30 };
        exitOffset = { x: -25, y: 20 };
      } else if (type === 'bottomRight') {
        initialOffset = { x: 40, y: 30 };
        exitOffset = { x: 25, y: 20 };
      }
    }

    // Cumulative sequential stagger requested: 0ms, 300ms, 600ms, 900ms
    const delay = shouldReduceMotion ? 0 : orderIndex * 0.3;

    return {
      initial: {
        x: initialOffset.x,
        y: initialOffset.y,
        opacity: 0,
        rotate: targetRotate,
      },
      animate: {
        x: 0,
        y: 0,
        opacity: 1,
        rotate: targetRotate,
      },
      exit: {
        x: exitOffset.x,
        y: exitOffset.y,
        opacity: 0,
        rotate: targetRotate,
      },
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7, // 700ms smooth fade-and-move animation (600–800ms)
        delay,
        ease: [0.25, 1, 0.5, 1], // Smooth easing curve
      },
    };
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.frame}>
        <div className={styles.panel}>
          {/* Shared Persistent Overlay: Connect with our Specialist (visible and clickable on every slide) */}
          <motion.a
            href="#audience"
            className={styles.badge}
            initial={{ y: shouldReduceMotion ? 0 : -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.7,
              delay: shouldReduceMotion ? 0 : (isInitialMount ? 1.1 : 0),
              ease: 'easeOut',
            }}
          >
            Connect with our Specialist <ArrowRight aria-hidden="true" />
          </motion.a>

          {/* AnimatePresence for smooth, seamless slide transitions (600-900ms) */}
          <AnimatePresence>
            <motion.div
              key={`slide-${activeSlide.id}`}
              data-slide={activeSlide.id}
              className={styles.slide}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.75,
                ease: 'easeInOut',
              }}
              onAnimationComplete={() => {
                setIsTransitioning(false);
              }}
            >
              {/* Slide Background Image Layer */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("${activeSlide.bgImage}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />

              {/* Slide Gradient Atmosphere Overlay Layer */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: SLIDE_GRADIENTS[activeSlide.id],
                }}
              />

              {/* Decorative Corner / Side Graphics with Directional Entrances and Sequential Stagger */}
              {[
                ['topLeftGraphic', styles.topLeft, 'topLeft'],
                ['topRightGraphic', styles.topRight, 'topRight'],
                ['bottomLeftGraphic', styles.bottomLeft, 'bottomLeft'],
                ['bottomRightGraphic', styles.bottomRight, 'bottomRight'],
              ]
                .filter(([asset]) => Boolean(activeSlide[asset]))
                .map(([asset, position, type], index) => {
                  const anim = getDecorationAnimation(type, position, activeSlide.id, index);
                  return (
                    <motion.img
                      key={`${activeSlide.id}-${asset}`}
                      src={activeSlide[asset]}
                      alt=""
                      className={`${styles.decoration} ${position}`}
                      initial={anim.initial}
                      animate={heroReady ? anim.animate : anim.initial}
                      exit={anim.exit}
                      transition={anim.transition}
                    />
                  );
                })}

              {/* Left Showcase Card - Enters & exits smoothly */}
              <motion.img
                src={activeSlide.leftCardImage}
                alt="Left Showcase Card"
                className={`${styles.card} ${styles.leftCard}`}
                initial={{
                  x: shouldReduceMotion ? 0 : -75,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  x: shouldReduceMotion ? 0 : -55,
                  opacity: 0,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.75,
                  delay: shouldReduceMotion ? 0 : (isInitialMount ? 1.05 : 0.04),
                  ease: [0.16, 1, 0.3, 1],
                }}
              />

              {/* Right Showcase Card - Enters & exits smoothly */}
              <motion.img
                src={activeSlide.rightCardImage}
                alt="Right Showcase Card"
                className={`${styles.card} ${styles.rightCard}`}
                initial={{
                  x: shouldReduceMotion ? 0 : 75,
                  opacity: 0,
                  scale: shouldReduceMotion ? 1 : 0.96,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  x: shouldReduceMotion ? 0 : 55,
                  opacity: 0,
                  scale: 0.96,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.75,
                  delay: shouldReduceMotion ? 0 : (isInitialMount ? 1.15 : 0.08),
                  ease: [0.16, 1, 0.3, 1],
                }}
              />

              {/* Hero Headline & Subtitle with subtle fade-up entrance & exit */}
              <motion.div
                className={styles.content}
                initial={{
                  y: shouldReduceMotion ? 0 : 20,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: shouldReduceMotion ? 0 : -16,
                  opacity: 0,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.7,
                  delay: shouldReduceMotion ? 0 : (isInitialMount ? 1.2 : 0.06),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <h1 className={styles.title}>
                  {activeSlide.titlePrefix}<br />
                  <span className={styles.highlight}>{activeSlide.titleHighlight}</span>
                </h1>
                <p className={styles.subtitle}>
                  {activeSlide.subtitle}
                </p>
              </motion.div>

              {/* Hero Statistics with subtle fade-up entrance & exit */}
              <motion.div
                className={styles.stats}
                initial={{
                  y: shouldReduceMotion ? 0 : 16,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: shouldReduceMotion ? 0 : -12,
                  opacity: 0,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.7,
                  delay: shouldReduceMotion ? 0 : (isInitialMount ? 1.35 : 0.1),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {activeSlide.stats.map((stat) => (
                  <div className={styles.stat} key={stat.label}>
                    <span className={styles.number}>{stat.number}</span>
                    <span className={styles.label}>{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Persistent Shared Overlay: Slide Indicator Dots with Vertical Top-to-Bottom Progress Fill */}
          <motion.div
            className={styles.indicator}
            aria-label="Hero slides"
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              delay: shouldReduceMotion ? 0 : (isInitialMount ? 1.15 : 0),
            }}
          >
            {slides.map((slide, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleSlideChange(idx)}
                  className={styles.dot}
                  aria-label={`Slide ${idx + 1}`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.span
                      key={`dot-fill-${slide.id}`}
                      className={styles.dotFill}
                      initial={{ scaleY: shouldReduceMotion ? 1 : 0 }}
                      animate={{ scaleY: 1 }}
                      style={{ transformOrigin: 'top center' }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : AUTOPLAY_INTERVAL / 1000,
                        ease: 'linear',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* CTA Action Buttons */}
        <motion.div
          className={styles.cta}
          initial={{
            opacity: shouldReduceMotion ? 1 : 0,
            y: shouldReduceMotion ? 0 : 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            delay: shouldReduceMotion ? 0 : (isInitialMount ? 1.45 : 0),
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <a href="#services" className={styles.start}>Get Started</a>
          <a href="#services" className={styles.explore}>
            Explore <ArrowRight aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
