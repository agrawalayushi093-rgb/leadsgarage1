import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LeadershipTeam() {
  const sectionRef = useRef(null);
  const cardWrapperRefs = useRef([]);
  const shouldReduceMotion = useReducedMotion();
  const [hoveredLeader, setHoveredLeader] = useState(null);

  // Reset cardWrapperRefs on each render cycle before collecting current elements
  cardWrapperRefs.current = [];
  const addToCardWrappers = (el) => {
    if (el && !cardWrapperRefs.current.includes(el)) {
      cardWrapperRefs.current.push(el);
    }
  };

  const leaders = [
    {
      name: 'Kunal Shrivastava',
      role: 'Co-Founder & CEO',
      image: '/image/Home/kunal.png',
      linkedin: 'https://linkedin.com',
      email: 'mailto:kunal@leadsgarage.com',
    },
    {
      name: 'Harshit Shrivastava',
      role: 'Co-Founder & CEO',
      image: '/image/Home/Harshit.png',
      linkedin: 'https://linkedin.com',
      email: 'mailto:harshit@leadsgarage.com',
    },
  ];

  // GSAP ScrollTrigger: Pin #team and progressively scale down BOTH entire profile cards
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || cardWrapperRefs.current.length === 0) return;

    if (shouldReduceMotion) {
      gsap.set(cardWrapperRefs.current, { scale: 1.0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'leadership-team-pin',
          trigger: section,
          start: 'top top',
          end: '+=650',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        cardWrapperRefs.current,
        {
          scale: 1.0,
          transformOrigin: 'top center',
          willChange: 'transform',
        },
        {
          scale: 0.8,
          transformOrigin: 'top center',
          ease: 'none',
        }
      );
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  return (
    <section ref={sectionRef} id="team" className="py-16 sm:py-20 lg:py-24 bg-[#FDFBF7] relative w-full overflow-visible">
      
      {/* Light Grid Background matching Figma Group 40121.png 1:1 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-start">
        <img
          src="/image/Home/Group 40121.png"
          alt="Grid Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div id="faces-behind-success" className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 scroll-mt-24 sm:scroll-mt-28 lg:scroll-mt-32">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            The Faces Behind Our Success
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal mt-3 leading-relaxed sm:whitespace-nowrap">
            Our leadership team brings a wealth of experience, innovation, and passion to Leads Garage.
          </p>
        </div>

        {/* 2 Leadership Cards — Scaled down as complete cards via pinned ScrollTrigger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-3xl mx-auto items-start">
          {leaders.map((leader, idx) => {
            const isHovered = hoveredLeader === idx;
            return (
              <div
                key={leader.name}
                ref={addToCardWrappers}
                className="leader-card-wrapper w-full flex justify-center will-change-transform"
                style={{ transformOrigin: 'top center' }}
              >
                <div
                  tabIndex={0}
                  onMouseEnter={() => setHoveredLeader(idx)}
                  onMouseLeave={() => setHoveredLeader(null)}
                  className={`leader-card group relative rounded-[2.5rem] p-5 sm:p-6 text-center transition-all duration-300 bg-transparent border border-transparent shadow-none hover:bg-white hover:border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:scale-[1.02] cursor-pointer w-full ${
                    isHovered ? 'is-hovered bg-white border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] scale-[1.02]' : ''
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative rounded-[2rem] overflow-hidden aspect-[4/4.5] bg-[#282A2D] mb-5 shadow-sm transition-transform duration-300 group-hover:scale-[1.01]">
                    <div className="w-full h-full overflow-hidden flex items-center justify-center">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top filter contrast-[1.02] brightness-[1.02]"
                      />
                    </div>
                  </div>

                  {/* Leader Name */}
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                    {leader.name}
                  </h3>

                  <p className="leader-role">{leader.role}</p>

                  {/* Revealed when hovered, stays active seamlessly when cursor is anywhere inside the card */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0 group-hover:max-h-52 group-hover:opacity-100 group-hover:mt-2 pointer-events-auto ${
                      isHovered ? 'max-h-52 opacity-100 mt-2' : ''
                    }`}
                  >
                    {/* Divider Line */}
                    <div className="w-24 h-[1px] bg-slate-200/80 mx-auto mb-3" />

                    {/* Let's Connect Label */}
                    <p className="text-xs font-semibold text-slate-500 mb-3">
                      Let's Connect
                    </p>

                    {/* Blue Social Icons matching Image 2 1:1 */}
                    <div className="flex items-center justify-center gap-3 pb-1">
                      <a
                        href={leader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-[#1866E5] hover:bg-[#1253BE] text-white flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 cursor-pointer pointer-events-auto relative z-10"
                        aria-label={`${leader.name} LinkedIn`}
                      >
                        <img
                          src="/image/Home/linkedin.png"
                          alt=""
                          className="w-full h-full object-contain pointer-events-none select-none"
                        />
                      </a>

                      <a
                        href={leader.email}
                        className="w-11 h-11 rounded-full bg-[#1866E5] hover:bg-[#1253BE] text-white flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 cursor-pointer pointer-events-auto relative z-10"
                        aria-label={`Email ${leader.name}`}
                      >
                        <img
                          src="/image/Home/email.png"
                          alt=""
                          className="w-full h-full object-contain pointer-events-none select-none"
                        />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
