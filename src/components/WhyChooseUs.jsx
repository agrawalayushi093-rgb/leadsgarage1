import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './WhyChooseUs.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function WhyChooseUs({ onOpenContact }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  const addToCardRefs = (el, idx) => {
    if (el) {
      cardRefs.current[idx] = el;
    }
  };

  const cards = [
    {
      id: 'call-transfers',
      title: 'Instant Call Transfers',
      description: 'Connect callers instantly with your agents and close more deals, faster.',
      image: '/image/Home/section3/Group 40062.png'
    },
    {
      id: 'lead-delivery',
      title: 'Real-Time Lead Delivery',
      description: "We deliver leads the moment they're generated, so you never miss an opportunity.",
      image: '/image/Home/section3/Group 39954.png'
    },
    {
      id: 'link-out',
      title: 'High-Intent Link-Out Traffic',
      description: "Drive qualified, high-intent traffic that's ready to take action.",
      image: '/image/Home/section3/Group 40094.png'
    },
    {
      id: 'smart-list',
      title: 'Smart List Management',
      description: 'Clean, verified, and well-managed lists that improve reach and deliverability.',
      image: '/image/Home/section3/Group 40063.png'
    },
    {
      id: 'geo-targeted',
      title: 'Geo-Targeted Customer Acquisition',
      description: 'Reach the right audience in the right location for higher conversions and better ROI.',
      image: '/image/Home/section3/Group 39956.png'
    }
  ];

  // GSAP ScrollTrigger Pinned Stacking Card Animation with sticky heading
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let ctx;
    const initAnimation = () => {
      ctx = gsap.context(() => {
        const cardsList = cardRefs.current.filter(Boolean);
        const totalCards = cardsList.length;
        if (totalCards === 0) return;

        // Responsive stack gap offset (42px desktop, 30px tablet, 18px mobile)
        const getStackGap = () => {
          if (window.innerWidth < 640) return 18;
          if (window.innerWidth < 1024) return 30;
          return 42;
        };

        const getHeaderOffset = () => {
          return window.innerWidth < 768 ? 64 : 76;
        };

        const stackGap = getStackGap();

        // Initial card positions:
        // Card 0 starts visible; incoming cards 1 to N-1 start offset below
        cardsList.forEach((card, index) => {
          if (index === 0) {
            gsap.set(card, { yPercent: 0, y: 0, scale: 1, zIndex: 10 });
          } else {
            gsap.set(card, { yPercent: 115, y: 0, scale: 1, zIndex: 10 + index * 10 });
          }
        });

        // Master GSAP Timeline pinned to stage (keeps heading + subtitle sticky while cards stack underneath)
        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'solutions-pin',
            trigger: stage,
            start: () => `top top+=${getHeaderOffset()}`,
            end: () => `+=${window.innerHeight * 0.75 * (totalCards - 1)}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        // Animate each incoming card to its stacked vertical offset
        for (let i = 1; i < totalCards; i++) {
          const incomingCard = cardsList[i];
          const targetY = i * stackGap;

          // Incoming card slides up smoothly into its stacked position
          tl.to(incomingCard, {
            yPercent: 0,
            y: targetY,
            ease: 'none',
            duration: 1,
          });

          // Previous cards remain visible with subtle scale depth
          for (let j = 0; j < i; j++) {
            const prevCard = cardsList[j];
            const depthFromActive = i - j;
            const targetScale = Math.max(0.97, 1 - depthFromActive * 0.01);
            tl.to(prevCard, {
              scale: targetScale,
              ease: 'none',
              duration: 1,
            }, '<');
          }
        }
      }, sectionRef);
    };

    initAnimation();

    // Re-calculate after layout stabilization
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [cards.length]);

  return (
    <section id="solutions" ref={sectionRef} className="why-section relative w-full bg-transparent py-4 sm:py-8">
      <div className="why-rail w-full max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
        <div ref={stageRef} className={styles.stage}>
        
        {/* Section Heading: Stays sticky with stage until all cards complete */}
        <div className="why-heading relative z-20 pt-1 pb-1 mb-2 sm:mb-3 text-center max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] font-black text-[#222225] tracking-tight whitespace-nowrap">
            Why Leading Brands Choose LeadsGarage
          </h2>
          <p className="text-sm sm:text-base md:text-[17px] text-[#55555C] font-normal mt-2 max-w-3xl mx-auto tracking-normal">
            Powerful solutions. Smarter strategies. Measurable growth for your business.
          </p>
        </div>

        {/* GSAP ScrollTrigger Pinned Stacking Cards Stage */}
        <div 
          className={`cards-stage ${styles.stack} w-full relative min-h-[520px] sm:min-h-[660px] md:min-h-[720px] flex justify-center items-start mt-1 mb-2`}
        >
          {cards.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => addToCardRefs(el, idx)}
              onClick={() => onOpenContact && onOpenContact()}
              className={`solution-card-wrapper card card-${idx + 1} ${styles.item} w-full flex justify-center p-0 m-0 bg-transparent border-0 shadow-none cursor-pointer`}
            >
              <div className="solution-surface w-full relative bg-transparent border-0 shadow-none p-0 m-0 overflow-hidden flex justify-center items-center">
                <div className="solution-art w-full overflow-hidden rounded-2xl sm:rounded-3xl p-0 m-0 bg-transparent border-0 shadow-none">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-auto object-contain block transform scale-[1.01] origin-top-left transition-transform duration-500 group-hover:scale-[1.025] select-none"
                  />
                </div>
                <div className="solution-copy">
                  <h3 className={`solution-title solution-title-${card.id}`}>
                    {card.id === 'call-transfers' ? <>Instant Call<span className="desktop-break"><br /></span> Transfers</> :
                      card.id === 'lead-delivery' ? <>Real-Time<span className="desktop-break"><br /></span> Lead Delivery</> :
                      card.id === 'link-out' ? <>High-Intent<span className="desktop-break"><br /></span> Link-Out Traffic</> :
                      card.id === 'smart-list' ? <>Smart List<span className="desktop-break"><br /></span> Management</> :
                      <>Geo-Targeted<span className="desktop-break"><br /></span> Customer Acquisition</>}
                  </h3>
                  <p className={`solution-description solution-description-${card.id}`}>
                    {card.id === 'call-transfers' ? <>Connect callers instantly with your agents<span className="desktop-break"><br /></span> and close more deals, faster.</> :
                      card.id === 'lead-delivery' ? <>We deliver leads the moment they're<span className="desktop-break"><br /></span> generated, so you never miss an opportunity.</> :
                      card.id === 'link-out' ? <>Drive qualified, high-intent traffic<span className="desktop-break"><br /></span> that's ready to take action.</> :
                      card.id === 'smart-list' ? <>Clean, verified, and well-managed lists<span className="desktop-break"><br /></span> that improve reach and deliverability.</> :
                      <>Reach the right audience in the right location<span className="desktop-break"><br /></span> for higher conversions and better ROI.</>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

      </div>
    </section>
  );
}
