import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardCTA() {
  return (
    <section id="showcase" className="relative w-full pt-4 sm:pt-6 lg:pt-8 pb-8 overflow-hidden bg-[#FDFBF7]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Showcase Image Display matching Reference 1:1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-[1360px] mx-auto overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl bg-white border border-slate-100 p-4 sm:p-8 lg:p-12 group"
        >
          {/* Main 3D Perspective Graphic */}
          <img
            src="/image/Home/footer/Group 40027.png"
            alt="Platform Showcase & Dashboard Perspective"
            className="w-full h-auto object-contain transform group-hover:scale-[1.01] transition-transform duration-500"
          />
        </motion.div>

      </div>
    </section>
  );
}
