import React from 'react';
import { Shield, Target, Microscope, Heart, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import ChromaGrid from '../components/ChromaGrid';
import { teamMembers } from '../data/teamMembers';

const C = {
  bg: '#DCF4F1',
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  surface: 'rgba(255,255,255,0.75)',
  border: 'rgba(6,41,38,0.12)',
};

const pillars = [
  {
    icon: Microscope,
    title: 'The Root-Cause Philosophy',
    body: 'Modern medicine excels at acute care but often fails to address the chronic degradation of optimal health. At ALLC, we integrate physical, mental, social, and environmental well-being to achieve true longevity.',
  },
  {
    icon: Target,
    title: 'Unlaunched & Exclusive',
    body: 'We are currently in a highly selective operating phase. Because our protocols are deeply exhaustive and personalized to your unique biological signature, we cannot scale at the cost of clinical efficacy.',
  },
  {
    icon: Heart,
    title: 'Evidence-Based Care',
    body: 'Every intervention at ALLC is grounded in peer-reviewed research. We do not guess — we measure, analyze, and prescribe with precision that standard care cannot match.',
  },
];

const stats = [
  { value: '6', label: 'Lifestyle Pillars' },
  { value: '90', label: 'Day Protocol' },
  { value: '100%', label: 'Personalized' },
];

const About = () => {
  return (
    <main
      className="w-full min-h-screen pt-[110px] md:pt-[140px] pb-32 px-6 md:px-12 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
    >
      {/* Hero */}
      <motion.div
        className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6 mb-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-[0.15em] uppercase"
          style={{ border: `1px solid ${C.accent}40`, background: `${C.accent}15`, color: C.accent }}
        >
          Our Foundation
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{ color: C.primary }}
        >
          A New Standard in{' '}
          <span className="block mt-2" style={{ color: C.accent }}>
            Longevity.
          </span>
        </h1>
        <p className="text-base md:text-lg leading-relaxed max-w-2xl mt-4" style={{ color: C.muted }}>
          The Asian Lifestyle Longevity Clinic (ALLC) represents the pinnacle of modern clinical strategy. Grounded in evidence-based lifestyle medicine, we focus on identifying and correcting the root causes of diseases rather than relying on standard temporary fixes.
        </p>
      </motion.div>

      {/* Stats Row */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-24">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center text-center p-6 rounded-2xl"
            style={{ background: C.surface, border: `1px solid ${C.border}`, backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: C.accent }}>{s.value}</span>
            <span className="text-xs font-bold tracking-widest uppercase mt-1" style={{ color: C.muted }}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
        {/* Left: Pillars */}
        <div className="flex flex-col gap-8">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                className="flex gap-5 p-6 rounded-2xl"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl"
                  style={{ background: `${C.accent}18`, color: C.accent }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: C.primary }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{p.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Image + Location Card */}
        <motion.div
          className="w-full relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[2rem] shadow-2xl"
          style={{ border: `1px solid ${C.border}` }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80"
            alt="Clinic Interior"
            className="w-full h-full object-cover hover:scale-105 transition-all duration-1000"
            style={{ filter: 'saturate(0.85) brightness(0.95)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${C.bg}CC 0%, transparent 60%)` }}
          />

          {/* Floating Location Card */}
          <div
            className="absolute bottom-6 left-6 right-6 rounded-2xl p-6 shadow-2xl backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid ${C.border}` }}
          >
            <h4 className="font-bold text-sm tracking-widest uppercase mb-1" style={{ color: C.primary }}>
              Surgenesis Superspeciality
            </h4>
            <p className="text-xs leading-loose" style={{ color: C.muted }}>
              187 Heeranagar, Ajmer Rd, opposite Star Residency, DCM.<br />
              Jaipur, Rajasthan 302021
            </p>
            <div className="w-full h-[1px] my-4" style={{ background: C.border }} />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono" style={{ color: C.accent }}>COORDINATES.LOCKED</span>
              <Shield size={16} style={{ color: C.accent }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Team Section */}
      <motion.div
        className="w-full mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-16">
          <div
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-[0.15em] uppercase mb-6"
            style={{ border: `1px solid ${C.accent}40`, background: `${C.accent}15`, color: C.accent }}
          >
            <Users size={14} className="mr-2" /> Our Team
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4"
            style={{ color: C.primary }}
          >
            Meet Our{' '}
            <span style={{ color: C.accent }}>Clinical Excellence</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: C.muted }}>
            Our team of specialized practitioners brings decades of combined experience in evidence-based lifestyle medicine, clinical epidemiology, rehabilitation, and personalized health optimization. Each member is dedicated to delivering the highest standard of care.
          </p>
        </div>

        {/* Chroma Grid - Team Members */}
        <ChromaGrid items={teamMembers} />
      </motion.div>
    </main>
  );
};

export default About;
