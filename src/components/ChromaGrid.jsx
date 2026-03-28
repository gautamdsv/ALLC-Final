import React, { useState } from 'react';
import { motion } from 'framer-motion';

const C = {
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  surface: 'rgba(255,255,255,0.75)',
  border: 'rgba(6,41,38,0.12)',
};

const ChromaGrid = ({ items = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // first item is the founder, rest are team
  const founder = items[0];
  const others = items.slice(1);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Founder — full width */}
        {founder && (
          <motion.div
            className="mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative h-80 md:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(0)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ border: `1px solid ${C.border}` }}
            >

              <img
                src={founder.avatar}
                alt={founder.name}
                className="w-full h-full object-cover transition-all duration-500"
                style={{
                  objectPosition: 'center 20%',
                  filter: hoveredIdx === 0 ? 'grayscale(0%)' : 'grayscale(100%)',
                }}
              />


              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${C.primary}CC 100%)`,
                }}
              />


              <div className="absolute inset-0 flex flex-col items-center justify-end p-10 text-center">
                <motion.h3
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: '#fff' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {founder.name}
                </motion.h3>

                <motion.p
                  className="text-sm md:text-base font-semibold mb-3"
                  style={{ color: C.accent }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {founder.role}
                </motion.p>

                <motion.p
                  className="text-xs md:text-sm max-w-md mb-4"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {founder.credentials}
                </motion.p>


                <motion.div
                  className="flex flex-wrap gap-2 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {founder.specialties?.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                      style={{
                        background: `${C.accent}40`,
                        color: '#fff',
                        border: `1px solid ${C.accent}`,
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {others.map((item, idx) => (
            <motion.div
              key={idx + 1}
              className="relative h-96 md:h-[400px] rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx + 1)}
              onMouseLeave={() => setHoveredIdx(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              style={{ border: `1px solid ${C.border}` }}
            >
              {/* Background Image with Grayscale */}
              <img
                src={item.avatar}
                alt={item.name}
                className="w-full h-full object-cover transition-all duration-500"
                style={{
                  objectPosition: 'center 20%',
                  filter: hoveredIdx === idx + 1 ? 'grayscale(0%)' : 'grayscale(100%)',
                }}
              />


              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${C.primary}CC 100%)`,
                }}
              />


              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <motion.h3
                  className="text-xl md:text-2xl font-bold mb-2"
                  style={{ color: '#fff' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.name}
                </motion.h3>

                <motion.p
                  className="text-xs md:text-sm font-semibold mb-2"
                  style={{ color: C.accent }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.role}
                </motion.p>

                <motion.p
                  className="text-[10px] md:text-xs max-w-xs mb-3"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {item.credentials}
                </motion.p>


                <motion.div
                  className="flex flex-wrap gap-2 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {item.specialties?.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase"
                      style={{
                        background: `${C.accent}40`,
                        color: '#fff',
                        border: `1px solid ${C.accent}`,
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChromaGrid;
