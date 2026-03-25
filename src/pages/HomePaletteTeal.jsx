import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Activity, Microscope, Shield, Factory, CheckCircle2,
  Brain, Dumbbell, Flame, Leaf, Target, Fingerprint, LineChart, Sparkles, ArrowRight
} from 'lucide-react';
import { TimelineFeatures } from '../components/TimelineFeatures';
import { AppleCardsCarousel } from '../components/AppleCardsCarousel';

import resetImg from '../assets/images/programs/reset.jpg';
import diagnosticImg from '../assets/images/programs/diagnostic.jpg';
import metabolicImg from '../assets/images/programs/metabolic.jpg';
import endocrinologyImg from '../assets/images/programs/endocrinology.jpg';
import nutritionImg from '../assets/images/programs/nutrition.jpg';
import optimizationImg from '../assets/images/programs/optimization.jpg';
import rhythmImg from '../assets/images/programs/rhythm.jpg';
import lifestyleImg from '../assets/images/programs/lifestyle.jpg';

const C = {
  primary:    '#062926',
  bgLight:    '#DCF4F1',
  bgMid:      '#A8E3DE',
  bgTeal:     '#5ECDC6',
  surface:    '#FFFFFF',
  surfaceAlt: '#EEF9F8',
  accent:     '#2AB5A5',
  accentHov:  '#1D9A8C',
  heading:    '#062926',
  body:       '#1C3835',
  muted:      '#527B78',
  onAccent:   '#FFFFFF',
  border:     '#C4E8E4',
};


const featuresData = [
  { icon: Microscope, title: 'Root Cause Focus',   description: 'Moving beyond symptom management to identify and treat the underlying cellular and lifestyle causes.' },
  { icon: Factory,    title: 'Evidence-Based',     description: 'Every intervention is rigorously backed by the latest clinical data and scientific evidence.' },
  { icon: Activity,   title: 'Highly Personalized',description: 'Tailored health plans based on individual data nodes: labs, habits, and personal goals.' },
  { icon: Shield,     title: 'Longevity-Centric',  description: 'Our primary focus is on adding vibrant life to your years, not just years to your life.' },
];

const programsData = [
  { category: 'Reset',         title: 'The Longevity Reset',        src: resetImg,         description: 'Reclaim the health you were meant to have.',            icon: <Brain size={24} /> },
  { category: 'Diagnostic',    title: 'Beyond The Diagnosis',       src: diagnosticImg,    description: "Diabetes doesn't have to be a life sentence.",          icon: <Activity size={24} /> },
  { category: 'Metabolic',     title: 'Metabolic Liberation',       src: metabolicImg,     description: 'Not weight loss. A complete biological transformation.', icon: <Dumbbell size={24} /> },
  { category: 'Endocrinology', title: 'Hormonal Harmony',           src: endocrinologyImg, description: 'Restore your cycle. Reclaim your energy.',               icon: <Flame size={24} /> },
  { category: 'Nutrition',     title: 'The Liver Renewal Protocol', src: nutritionImg,     description: 'Reverse the damage. Rebuild from within.',               icon: <Leaf size={24} /> },
  { category: 'Optimization',  title: 'Metabolic Reawakening',      src: optimizationImg,  description: 'One protocol. Every marker, corrected.',                 icon: <Activity size={24} /> },
  { category: 'Rhythm',        title: 'Rhythm Restored',            src: rhythmImg,        description: 'Rebalance your thyroid. Rebalance your life.',           icon: <Microscope size={24} /> },
  { category: 'Lifestyle',     title: 'The Kitchen Cure',           src: lifestyleImg,     description: 'Your home is your first clinic. We transform it.',       icon: <CheckCircle2 size={24} /> },
];

const whyData = [
  { icon: Activity,    title: 'Integrated Care',         description: 'Medicine and lifestyle work together — not separately. We treat you as a whole system, not a collection of symptoms.' },
  { icon: Shield,      title: 'Doctor-Led Approach',     description: 'Every protocol is clinically supervised and safely executed under the direct guidance of Dr. Divya Gautam.' },
  { icon: Target,      title: 'Root Cause Focus',        description: "We don't mask your condition — we investigate and eliminate its origin. Permanent results, not temporary relief." },
  { icon: Fingerprint, title: 'Personalized Plans',      description: 'No two patients are the same. Your protocol is tailored specifically to your body, condition, and lifestyle.' },
  { icon: LineChart,   title: 'Structured System',       description: 'A clear, measurable process with defined milestones and continuous support — so you always know where you stand.' },
  { icon: Leaf,        title: 'Medication Optimization', description: "Heal smarter. Our approach is designed to reduce drug dependency and restore your body's natural vitality." },
];

// Hero section
const Hero = ({
  paddingTop        = '120px',
  paddingBottom     = '80px',
  gapBetweenColumns = '80px',
}) => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const scaleOff   = useTransform(scrollYProgress, [0, 1],   [1, 0.88]);
  const opacityOff = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={heroRef} className="w-full relative h-[100vh]">
      <div
        className="w-full sticky top-0 h-[100vh] overflow-hidden flex items-center justify-center z-0 pt-[88px] md:pt-[110px]"
        style={{
          background: `
            radial-gradient(ellipse at top left,  #D0EFEC 0%, transparent 55%),
            radial-gradient(ellipse at bottom right, #3DCFC8 0%, transparent 60%),
            linear-gradient(135deg, #E4F7F5 0%, #B2E5E1 40%, #5ECDC6 100%)
          `,
        }}
      >
        {/* noise texture for depth */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${C.bgLight})` }}
        />

        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between"
          style={{ 
            scale: scaleOff, 
            opacity: opacityOff, 
            paddingTop, 
            paddingBottom, 
            gap: gapBetweenColumns,
            marginTop: 'calc(72px + 4vh)'
          }}
        >

          <motion.div
            className="w-full lg:w-[48%] flex flex-col items-start"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
              style={{ backgroundColor: C.primary }}
            >
              <Sparkles size={12} color="#FFFFFF" />
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-white">
                Lifestyle Medicine · Wellness · Longevity
              </p>
            </div>


            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1]"
              style={{ color: C.heading, marginBottom: '20px' }}
            >
              Your health<br />
              journey,{' '}
              <span style={{ color: C.accent }}>reimagined</span>{' '}
              with care.
            </h1>


            <p
              className="text-base sm:text-lg leading-relaxed max-w-[42ch]"
              style={{ color: C.body, marginBottom: '48px' }}
            >
              Evidence-based lifestyle medicine that integrates nutrition, movement, and mindful living — designed for lasting transformation.
            </p>


            <div className="flex flex-wrap gap-6 sm:gap-10">
              {[
                { value: '2000', suffix: '+', label: 'Patients' },
                { value: '98',   suffix: '%', label: 'Success Rate' },
                { value: '12',   suffix: '+', label: 'Years Experience' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.12 }}>
                  <p className="text-3xl md:text-4xl font-bold mb-0.5" style={{ color: C.primary }}>
                    {s.value}<span style={{ color: C.accent }}>{s.suffix}</span>
                  </p>
                  <p className="text-xs tracking-[0.14em] font-semibold uppercase" style={{ color: C.muted }}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>


          <motion.div
            className="w-full lg:w-[46%] flex items-center justify-center relative h-[350px] sm:h-[480px] lg:h-[560px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >

            <div
              className="absolute top-8 right-8 left-0 bottom-0 rounded-[2.5rem]"
              style={{ backgroundColor: C.accent, opacity: 0.18 }}
            />

            <div
              className="absolute inset-0 left-6 top-0 right-0 bottom-8 rounded-[2.5rem] overflow-hidden shadow-2xl z-10"
              style={{ border: `1px solid rgba(255,255,255,0.5)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80"
                alt="Wellness"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.92) saturate(0.95)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Timeline scroll section
const colorsForTimeline = {
  primary:  C.primary,
  secondary: C.accent,
  tertiary:  C.bgMid,
  light:     C.surface,
  accent:    C.accent,
  mutedText: C.muted,
  bgAlt:     C.bgLight,
  cardBg:    C.surfaceAlt,
};

const Features = ({
  scrollDistance            = '450vh',
  entranceTopPosition       = '35vh',
  entranceTagBottomMargin   = '24px',
  entranceTitleBottomMargin = '32px',
  leftContentTopOffset      = '0px',
  nodeIconBottomMargin      = '40px',
  nodeTagBottomMargin       = '16px',
  nodeTitleBottomMargin     = '24px',
}) => {
  const bgColors   = [C.primary,    C.surface,  C.accent,   C.surfaceAlt];
  const textColors = [C.onAccent,   C.heading,  C.onAccent, C.heading];
  const iconBg     = [C.accent,     C.primary,  C.surface,  C.accent];
  const iconColor  = [C.primary,    C.onAccent, C.accent,   C.primary];

  const featureItems = featuresData.map((f, i) => ({
    id:          i,
    title:       f.title,
    description: f.description,
    icon:        <f.icon size={40} strokeWidth={1.5} />,
    bgColor:     bgColors[i],
    textColor:   textColors[i],
    iconBg:      iconBg[i],
    iconColor:   iconColor[i],
  }));

  return (
    <TimelineFeatures
      items={featureItems}
      colors={colorsForTimeline}
      scrollDistance={scrollDistance}
      entranceTopPosition={entranceTopPosition}
      entranceTagBottomMargin={entranceTagBottomMargin}
      entranceTitleBottomMargin={entranceTitleBottomMargin}
      leftContentTopOffset={leftContentTopOffset}
      nodeIconBottomMargin={nodeIconBottomMargin}
      nodeTagBottomMargin={nodeTagBottomMargin}
      nodeTitleBottomMargin={nodeTitleBottomMargin}
    />
  );
};

// Doctor bio section
const ClinicalOverview = ({
  paddingTop        = '160px',
  paddingBottom     = '160px',
  gapBetweenColumns = '80px',
  titleBottomMargin = '32px',
  textBottomMargin  = '48px',
}) => (
  <section
    className="w-full px-6 md:px-12 relative overflow-hidden"
    style={{ backgroundColor: C.bgLight, paddingTop, paddingBottom }}
  >
    {/* Decorative blobs */}
    <div
      className="absolute top-0 right-0 w-[45%] h-full rounded-l-full opacity-25 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at right, ${C.bgTeal}, transparent 70%)` }}
    />

    <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: gapBetweenColumns }}>
      {/* Left: Image stack */}
      <motion.div
        className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[580px] w-full"
        initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      >
        <div className="absolute top-8 left-8 right-0 bottom-0 rounded-[3rem]" style={{ backgroundColor: C.accent, opacity: 0.18 }} />
        <div className="absolute inset-0 right-8 bottom-8 rounded-[3rem] overflow-hidden shadow-xl z-10" style={{ border: `1px solid ${C.border}` }}>
          <img
            src="/images/team/dr-divya-gautam.jpeg"
            alt="Dr Divya"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 20%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,41,38,0.4)] to-transparent" />
        </div>
        {/* Floating badge */}
        <motion.div
          className="absolute bottom-10 sm:bottom-16 right-2 sm:left-6 z-20 px-6 py-4 rounded-2xl shadow-xl"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity }}
        >
          <p className="font-serif font-bold text-xl sm:text-2xl" style={{ color: C.primary }}>12+ Years</p>
          <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: C.muted }}>Experience</p>
        </motion.div>
      </motion.div>

      {/* Right: Content */}
      <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-5" style={{ color: C.accent }}>
          Meet Your Guide
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight"
          style={{ color: C.heading, marginBottom: titleBottomMargin }}
        >
          Dr. Divya Gautam
        </h2>
        <p className="text-base sm:text-lg md:text-xl leading-relaxed" style={{ color: C.body, marginBottom: textBottomMargin }}>
          12+ years of clinical expertise in reversing chronic disease through precision lifestyle medicine. Dr. Gautam seamlessly blends evidence-based science with the warmth of genuine patient care.
        </p>

        <div className="space-y-4 mb-12">
          {[
            { title: 'Advanced Certifications',     text: 'PGDLM from CMC Vellore & INFS Nutrition' },
            { title: 'Disease Reversal Specialist', text: 'Senior expertise in metabolic health & longevity' },
            { title: 'Patient-Centric Approach',    text: 'Each plan is uniquely tailored to your life' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex gap-5 items-center p-5 rounded-2xl"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
              whileHover={{ y: -2, boxShadow: `0 8px 24px ${C.accent}25` }}
            >
              <div
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: `${C.accent}18`, color: C.accent }}
              >
                <CheckCircle2 size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="font-serif font-bold text-base sm:text-lg mb-0.5" style={{ color: C.heading }}>{item.title}</p>
                <p className="text-sm" style={{ color: C.muted }}>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          className="px-8 py-4 rounded-xl font-semibold tracking-wide text-sm transition-all hover:scale-105"
          style={{ backgroundColor: C.accent, color: C.onAccent, boxShadow: `0 4px 20px ${C.accent}45` }}
        >
          Schedule a Consultation
        </button>
      </motion.div>
    </div>
  </section>
);

// Why choose us cards
const WhyChooseUs = ({ paddingTop = '120px', paddingBottom = '120px' }) => (
  <section
    className="w-full px-6 md:px-12 relative overflow-hidden"
    style={{ backgroundColor: C.surfaceAlt, paddingTop, paddingBottom }}
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at bottom center, ${C.bgMid}60, transparent 65%)` }}
    />

    <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
      <div
        className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full"
        style={{ backgroundColor: `${C.accent}18`, border: `1px solid ${C.accent}40` }}
      >
        <p className="text-sm font-bold tracking-[0.15em] uppercase" style={{ color: C.accent }}>
          WHY CHOOSE ALLC
        </p>
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-center mb-4" style={{ color: C.heading }}>
        Not Information.<br />True Transformation.
      </h2>
      <p className="text-base md:text-lg text-center mb-14 max-w-xl" style={{ color: C.muted }}>
        Clinically supervised. Systematically designed. Sustainably delivered.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {whyData.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              className="rounded-2xl p-8 flex flex-col items-start transition-all duration-400"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
              whileHover={{ y: -4, boxShadow: `0 12px 40px ${C.accent}20`, borderColor: `${C.accent}50` }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-2xl mb-5"
                style={{ backgroundColor: `${C.accent}16`, color: C.accent }}
              >
                <Icon size={28} strokeWidth={2} />
              </div>
              <h3 className="font-serif font-bold text-xl md:text-2xl mb-2" style={{ color: C.heading }}>
                {item.title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: C.muted }}>
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// Programs carousel
const ClinicalPrograms = ({
  paddingTop          = '160px',
  paddingBottom       = '160px',
  headingBottomMargin = '64px',
}) => (
  <section
    className="w-full relative overflow-hidden"
    style={{
      background: `linear-gradient(160deg, ${C.bgLight} 0%, ${C.bgMid} 40%, ${C.bgTeal} 100%)`,
      paddingTop,
      paddingBottom,
    }}
  >
    <div className="relative z-10 w-full max-w-[1400px] mx-auto">
      <motion.div
        className="px-6 md:px-12"
        style={{ marginBottom: headingBottomMargin }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4" style={{ color: C.accent }}>
          Proven Protocols
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight" style={{ color: C.heading }}>
          Transformative<br />Care Pathways.
        </h2>
      </motion.div>

      <AppleCardsCarousel items={programsData} />
    </div>
  </section>
);

// Page export
const HomePaletteTeal = () => (
  <main className="w-full flex flex-col" style={{ backgroundColor: C.bgLight }}>
    <Hero
      paddingTop="120px"
      paddingBottom="80px"
      gapBetweenColumns="80px"
      titleBottomMargin="24px"
      textBottomMargin="40px"
    />

    <Features
      scrollDistance="450vh"
      entranceTopPosition="15vh"
      entranceTagBottomMargin="24px"
      entranceTitleBottomMargin="32px"
      leftContentTopOffset="0px"
      nodeIconBottomMargin="15px"
      nodeTagBottomMargin="12px"
      nodeTitleBottomMargin="10px"
    />

    <ClinicalOverview
      paddingTop="90px"
      paddingBottom="90px"
      gapBetweenColumns="80px"
      titleBottomMargin="32px"
      textBottomMargin="48px"
    />

    <WhyChooseUs
      paddingTop="90px"
      paddingBottom="90px"
    />

    <ClinicalPrograms
      paddingTop="90px"
      paddingBottom="50px"
      headingBottomMargin="8px"
    />
  </main>
);

export default HomePaletteTeal;
