import React from 'react';
import { Microscope, Dna, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const C = {
  bg: '#DCF4F1',
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  surface: 'rgba(255,255,255,0.75)',
  border: 'rgba(6,41,38,0.12)',
};

const researchTopics = [
  {
    icon: Dna,
    title: 'Cellular Senescence',
    description: 'Investigating the mechanisms by which aging cells stop dividing and secrete inflammatory factors, and developing protocols to clear these senescent cells to restore tissue vitality.',
  },
  {
    icon: Activity,
    title: 'Metabolic Flexibility',
    description: 'Studying how the body seamlessly transitions between carbohydrate and fat oxidation, and optimizing this pathway to prevent insulin resistance and increase continuous energy output.',
  },
  {
    icon: Microscope,
    title: 'Advanced Biomarker Tracking',
    description: "Utilizing continuous glucose monitors, wearable tech, and deep liquid biopsies to create a real-time predictive model of a patient's biological age and healthspan trajectory.",
  },
];

const Research = () => {
  return (
    <main
      className="w-full min-h-screen pt-[110px] md:pt-[140px] pb-32 px-6 md:px-12 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
    >
      {/* Hero */}
      <motion.div
        className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6 mb-24"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-[0.15em] uppercase"
          style={{ border: `1px solid ${C.accent}40`, background: `${C.accent}15`, color: C.accent }}
        >
          Our Discovery
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]" style={{ color: C.primary }}>
          The Science Behind{' '}
          <br className="hidden md:block" />
          <span className="mt-2 block" style={{ color: C.accent }}>Our Protocols.</span>
        </h1>
        <p className="text-base md:text-lg leading-relaxed max-w-3xl mt-6" style={{ color: C.muted }}>
          At ALLC, our interventions are not guesses. They are derived from rigorous clinical research exploring the intersection of longevity science, molecular biology, and personalized lifestyle medicine. We are committed to solving the epidemic of chronic disease through proven discovery.
        </p>
      </motion.div>

      {/* Featured Research */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <motion.div
          className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative"
          style={{ border: `1px solid ${C.border}` }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=80"
            alt="Laboratory Research"
            className="w-full h-full object-cover hover:scale-105 transition-all duration-1000"
            style={{ filter: 'saturate(0.8) brightness(0.95)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top right, ${C.bg}BB 0%, transparent 60%)` }}
          />
          <div className="absolute bottom-6 left-6 right-6">
            <div
              className="rounded-xl p-5 shadow-xl backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.88)', border: `1px solid ${C.border}` }}
            >
              <span className="font-mono text-xs font-bold tracking-widest uppercase mb-2 block" style={{ color: C.accent }}>
                Active Clinical Trial
              </span>
              <p className="text-base leading-snug font-medium" style={{ color: C.primary }}>
                The effects of targeted nutritional interventions on biological age reversal markers.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-2" style={{ color: C.primary }}>
            Changing the Paradigm of Aging.
          </h2>
          <div className="w-16 h-1 rounded-full mb-2" style={{ background: C.accent }} />
          <p className="text-base md:text-lg leading-relaxed" style={{ color: C.muted }}>
            For decades, medicine has treated aging as an inevitable decline. Our research focuses on treating aging as a root-cause condition that can be slowed, and in some vectors, reversed.
          </p>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: C.muted }}>
            By analyzing massive datasets encompassing genomics, epigenetics, and metabolomics, we craft precise injection and nutritional protocols that trigger powerful cellular regeneration.
          </p>

          <Link
            to="/contact"
            className="mt-6 w-max flex items-center gap-3 group font-bold text-sm uppercase tracking-widest transition-colors"
            style={{ color: C.accent }}
          >
            Join Our Clinical Waitlist
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Research Pillars */}
      <div className="max-w-6xl mx-auto mb-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: C.primary }}>Core Research Pillars</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
            The foundational areas of scientific inquiry that drive our clinical programs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchTopics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={idx}
                className="rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-all duration-500"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  backdropFilter: 'blur(12px)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner"
                  style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}30`, color: C.accent }}
                >
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: C.primary }}>{topic.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{topic.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Research;
