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
          <div className="w-full h-full p-8 sm:p-10 lg:p-12 pb-0 sm:pb-0 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-blue-100 block tracking-tight">
                {card.tagline}
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                {card.title}
              </h3>
            </div>

            <div className="mt-8 flex justify-center items-end">
              <img
                src={card.image}
                alt={`${card.title} Illustration`}
                className="w-full max-w-md object-contain pointer-events-none drop-shadow-xl"
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
          <div className="w-full h-full p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="w-full lg:w-[55%] flex flex-col justify-between space-y-6 z-10">
              <div>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-blue-100 block tracking-tight">
                  {card.tagline}
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white mt-1">
                  {card.title}
                </h3>
              </div>

              <div className="space-y-4 text-blue-50/90 text-sm sm:text-base leading-relaxed font-normal">
                <p className="!text-blue-50/90">{card.description1}</p>
                <p className="!text-blue-50/90">{card.description2}</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenContact) onOpenContact();
                  }}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#1853E6] hover:bg-[#1245C8] border border-blue-300/40 text-white font-semibold text-sm sm:text-base shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="w-full lg:w-[45%] flex items-end justify-center lg:justify-end h-full">
              <img
                src={card.image}
                alt={`${card.title} Illustration`}
                className="w-full max-w-md lg:max-w-lg object-contain block drop-shadow-2xl pointer-events-none"
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
      className="py-6 sm:py-8 lg:py-8 lg:min-h-[calc(100dvh-var(--header-height,76px))] bg-[#FDFBF7] relative w-full flex flex-col items-center justify-center box-border"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Where Do you fit into this picture?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal mt-2 leading-relaxed">
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
