import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AudienceSegments.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function AudienceSegments({ onOpenContact }) {
  const sectionRef = useRef(null);
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx;
    const initPin = () => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        // Pin section on desktop/tablet (min-width: 768px), disable on mobile for usability
        mm.add('(min-width: 768px)', () => {
          ScrollTrigger.create({
            id: 'audience-pin',
            trigger: section,
            start: () => `top top+=${window.innerWidth < 768 ? 64 : 76}`,
            end: '+=500',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });
        });
      }, sectionRef);
    };

    initPin();

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  const cardsData = {
    publisher: {
      id: 'publisher',
      pillLabel: "I'm a Publisher",
      tagline: 'Are you a',
      title: 'Publisher?',
      description1:
        'As a publisher with LeadsGarage, we help you maximize the value of your traffic and drive high-converting leads through verified, real-time channels.',
      description2:
        'Our team provides dedicated support, flexible payout structures, and access to top-tier campaign offers to scale your business.',
      buttonText: "Let's connect",
      image: '/image/Home/Frame 1000004723.png'
    },
    advertiser: {
      id: 'advertiser',
      pillLabel: "I'm an Advertiser",
      tagline: 'Are you a',
      title: 'Advertiser?',
      description1:
        'As an advertiser with LeadsGarage, we understand you need customers to succeed, and we have seen the results inbound calls can do to help grow a business.',
      description2:
        'Our support team will work with you to help distribute your offers, monitor traffic and transfers, and choose the best path that gets you the right buyer.',
      buttonText: "Let's connect",
      image: '/image/Home/Frame 1000004724.png'
    }
  };

  const renderCard = (cardKey) => {
    const card = cardsData[cardKey];
    const isExpanded = hoveredTab === cardKey;
    const isCollapsed = hoveredTab !== null && hoveredTab !== cardKey;
    const isDefault = hoveredTab === null;

    let cardStateClass = styles.cardDefault;
    if (isExpanded) {
      cardStateClass = styles.cardExpanded;
    } else if (isCollapsed) {
      cardStateClass = styles.cardCollapsed;
    }

    return (
      <div
        key={card.id}
        onMouseEnter={() => setHoveredTab(cardKey)}
        className={`${styles.card} ${cardStateClass}`}
      >
        {/* Layer 1: Default State View */}
        <div
          className={`${styles.layer} ${
            isDefault ? styles.layerActive : styles.layerInactive
          }`}
        >
          <div className="w-full h-full p-6 sm:p-8 lg:p-7 xl:p-9 pb-0 sm:pb-0 lg:pb-0 xl:pb-0 flex flex-col justify-between overflow-hidden">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-lg sm:text-xl lg:text-2xl font-light text-blue-100 block tracking-tight">
                {card.tagline}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black tracking-tight text-white">
                {card.title}
              </h3>
            </div>

            <div className="flex-1 flex justify-center items-end min-h-0 overflow-hidden mt-2 sm:mt-4">
              <img
                src={card.image}
                alt={`${card.title} Illustration`}
                className="w-full max-w-[260px] sm:max-w-xs lg:max-w-sm xl:max-w-md h-full object-contain pointer-events-none drop-shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Layer 2: Expanded State View */}
        <div
          className={`${styles.layer} ${
            isExpanded ? styles.layerActive : styles.layerInactive
          }`}
        >
          <div className="w-full h-full p-5 sm:p-7 lg:p-6 xl:p-9 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 xl:gap-8 overflow-hidden">
            <div className="w-full lg:w-[55%] flex flex-col justify-between space-y-2.5 sm:space-y-3 lg:space-y-3 xl:space-y-5 z-10">
              <div>
                <span className="text-lg sm:text-xl lg:text-2xl font-light text-blue-100 block tracking-tight">
                  {card.tagline}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-white mt-0.5">
                  {card.title}
                </h3>
              </div>

              <div className="space-y-2 sm:space-y-2.5 text-blue-50/90 text-xs sm:text-sm lg:text-xs xl:text-sm leading-relaxed font-normal">
                <p className="!text-blue-50/90">{card.description1}</p>
                <p className="!text-blue-50/90">{card.description2}</p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenContact) onOpenContact();
                  }}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#1853E6] hover:bg-[#1245C8] border border-blue-300/40 text-white font-semibold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                </button>
              </div>
            </div>

            <div className="w-full lg:w-[45%] flex items-end justify-center lg:justify-end h-full min-h-0 overflow-hidden">
              <img
                src={card.image}
                alt={`${card.title} Illustration`}
                className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg h-full object-contain block drop-shadow-2xl pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Layer 3: Collapsed Vertical Pill View */}
        <div
          className={`${styles.layer} ${styles.collapsedLayer} ${
            isCollapsed ? styles.layerActive : styles.layerInactive
          }`}
        >
          <div className="w-full h-full p-4 flex md:flex-col items-center justify-between">
            <div className="flex-1 flex items-center justify-center">
              <span className="hidden md:block -rotate-90 whitespace-nowrap text-white font-medium text-base lg:text-lg tracking-wide select-none group-hover:text-blue-100 transition-colors">
                {card.pillLabel}
              </span>
              <span className="block md:hidden text-white font-medium text-base">
                {card.pillLabel}
              </span>
            </div>

            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform shadow-md">
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="audience"
      ref={sectionRef}
      className="py-4 sm:py-6 lg:py-5 lg:min-h-[calc(100dvh-var(--header-height,76px))] bg-[#FDFBF7] relative w-full flex flex-col items-center justify-center box-border"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-9">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight">
            Where Do you fit into this picture?
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-normal mt-1 sm:mt-1.5 leading-relaxed">
            We combine technology, data, and expertise to deliver measurable growth for your business.
          </p>
        </div>

        {/* Outer Cards Container Centered */}
        <div
          onMouseLeave={() => setHoveredTab(null)}
          className={styles.cardsWrapper}
        >
          <div className={styles.cardsContainer}>
            {renderCard('publisher')}
            {renderCard('advertiser')}
          </div>
        </div>
      </div>
    </section>
  );
}
