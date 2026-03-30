import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const C = {
  bg: '#DCF4F1',
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  surface: 'rgba(255,255,255,0.8)',
  border: 'rgba(6,41,38,0.12)',
};

const servicesData = [
  {
    id: '00',
    programNumber: 'CONSULTATION',
    title: 'Lifestyle Consultation',
    subtitle: 'Initial Assessment →',
    category: 'DIAGNOSTIC & ADVISORY',
    description: 'A deep-dive, expert-led health assessment including a 20-minute physiotherapy session and a comprehensive prescription.',
    phases: [
      { label: 'INDIVIDUAL', title: 'Individual Consultations', items: ['Essential (60 min) — Ideal for first-time consultation', 'Comprehensive (90 min) — Ideal for most patients', 'Premium (120 min) — Ideal for complex conditions'] },
      { label: 'PARTNERS', title: 'Partner Consultations', items: ['Partner Essential (90 min) — Budget-friendly couples', 'Partner Comprehensive (120 min) — Most couples', 'Partner Premium (150 min) — Deep transformation'] },
    ],
    pathways: [
      { id: 'ind-ess', name: 'Essential', duration: '60 Min', description: 'First-time individual consultation.', price: '₹5,000' },
      { id: 'ind-comp', name: 'Comprehensive', duration: '90 Min', description: 'Ideal for most individual patients.', price: '₹7,500' },
      { id: 'ind-prem', name: 'Premium', duration: '120 Min', description: 'Ideal for complex conditions.', price: '₹12,500' },
      { id: 'part-ess', name: 'Partner Essential', duration: '90 Min', description: 'Budget-friendly couples.', price: '₹8,500' },
      { id: 'part-comp', name: 'Partner Comp.', duration: '120 Min', description: 'Ideal for most couples.', price: '₹12,500' },
      { id: 'part-prem', name: 'Partner Premium', duration: '150 Min', description: 'Deep transformation for couples.', price: '₹22,500' }
    ],
    outcomes: ['1:1 Expert Consultation', '20-minute physiotherapy session', 'Detailed prescription (4–22 pages)', 'Clear next steps for your health journey'],
  },
  {
    id: '01',
    programNumber: 'PROGRAM 01',
    title: '90-Day Lifestyle Program',
    subtitle: 'From Normal To Optimal →',
    category: 'PREVENTIVE & LIFESTYLE MEDICINE',
    description: 'Feeling unwell despite "normal" reports? This structured program identifies root causes and rebuilds your health across all 6 pillars.',
    phases: [
      { label: 'Days 1–15', title: 'Discovery — Uncovering the root cause', items: ['Deep-dive health consultation', 'Personalized "Grey Area" report', 'Advanced lab recommendations', 'Movement & posture assessment', 'Kitchen audit'] },
      { label: 'Days 16–45', title: 'Transformation — The 6 Pillar Protocol', items: ['Personalized health plan (all 6 pillars)', 'Daily & weekly guided support', 'Habit building framework', 'Exercise & mindfulness sessions'] },
      { label: 'Days 46–90', title: 'Integration — Sustaining the new baseline', items: ['Progress review & plan refinement', 'Cooking workshop & lifestyle integration', 'Continuous support via WhatsApp', 'Final progress report & guidance'] },
    ],
    customSections: [
      { title: 'WHY THIS PROGRAM?', items: ['Feeling unwell despite "normal" reports?', 'Low energy, poor sleep, stubborn weight, digestive issues?', 'Tried multiple doctors and wellness programs but still no clear answers?', 'Helps you move from "normal" to truly optimal health.'] },
      { title: 'WHO IS IT FOR?', items: ['People with ongoing health concerns despite normal tests', 'Those seeking long-term transformation, not quick fixes', 'Individuals ready to commit time, effort & discipline', 'Those who value personalization & expert guidance'] },
    ],
    pathways: [
      { id: 'ind', name: 'Individual', duration: '3 Months', description: 'Personalized 1-on-1 lifestyle transformation.', price: '₹75,000' },
      { id: 'couple', name: 'Couples', duration: '3 Months', description: 'Transform together with shared accountability.', price: '₹1,25,000' }
    ],
    outcomes: ['1:1 expert consultations', 'Fully personalized health blueprint', 'Daily accountability support', 'Lifetime usable resources'],
  },
  {
    id: '02',
    programNumber: 'PROGRAM 02',
    title: 'Diabetes Reversal Program',
    subtitle: 'Decode & Restructure →',
    category: 'DIABETES REVERSAL PROGRAM',
    description: "A science-backed, doctor-led program designed to help you understand your diabetes, reduce medications safely, and achieve long-term control—naturally.",
    phases: [
      { label: 'PHASE 01', title: 'Decode — We cover the real reasons behind your diabetes.', items: ['Deep-dive consultation', 'Personalized Diabetes Signature Report', 'Advanced lab recommendations', 'CGM support & training', 'Movement assessment', 'Comprehensive Kitchen audit'] },
      { label: 'PHASE 02', title: 'Rebuild — We create and implement your personalized recovery plan.', items: ['Customized nutrition & lifestyle plan', 'Culinary training session', 'Exercise & sleep optimization', 'Weekly CGM review & medication adjustments', 'Monthly doctor consultations', 'Live culinary workshop', 'Continuous telephonic/whatsapp support & accountability'] },
      { label: 'PHASE 03', title: 'Sustain — We help you maintain results for life.', items: ['Progress tracking & lab reassessment', 'Safe medication reduction protocol', 'Long-term lifestyle blueprint', 'Final transformation review'] },
    ],
    customSections: [
      { title: 'WHAT MAKES THIS DIFFERENT?', items: ['Personalized—not generic', 'Continuous monitoring—not guesswork', 'Doctor-led medication reduction', 'Patient centric continuous support—not occasional visits'] },
    ],
    pathways: [
      { id: 'ind', name: 'Individual', duration: '12 Months', description: 'Includes Continuous Glucose Support', price: '₹3,75,000' },
      { id: 'c-both', name: 'Couples (Both Diabetic)', duration: '12 Months', description: 'Includes Continuous Glucose Support for both', price: '₹5,95,000' },
      { id: 'c-mixed', name: 'Couples (1 Preventive)', duration: '12 Months', description: '1 Diabetic + 1 Preventive partner', price: '₹4,95,000' }
    ],
    outcomes: ['Better blood sugar control', 'Reduced or eliminated medications', 'Improved energy, weight & confidence', 'A sustainable, healthy lifestyle'],
  },
  {
    id: '03',
    programNumber: 'PROGRAM 03',
    title: 'Metabolic Liberation',
    subtitle: 'Obesity & Weight →',
    category: 'OBESITY & WEIGHT MANAGEMENT',
    description: 'Not weight loss. A complete biological transformation.',
    phases: [
      { label: 'PHASE 01', title: 'Uncover — Identify metabolic blocks', items: ['Basal metabolic rate testing', 'Hormonal barrier assessment', 'Gut microbiome sequencing', 'Psychological eating triggers'] },
      { label: 'PHASE 02', title: 'Activate — Fat oxidation mode', items: ['Precision macronutrient ratios', 'Strength & hypertrophy protocols', 'Thermogenic lifestyle shifts', 'Non-exercise activity tracking'] },
      { label: 'PHASE 03', title: 'Maintain — The new baseline', items: ['Metabolic flexibility training', 'Adaptive calorie maintenance', 'Long-term behavioral shifts', 'Body composition tracking'] },
    ],
    pathways: [
      { id: 'ind', name: 'Individual', duration: '6 Months', description: 'Dedicated personal biological transformation.', price: '₹1,30,000' },
      { id: 'couple', name: 'Couples', duration: '6 Months', description: 'Transform together with shared accountability.', price: '₹1,95,000' }
    ],
    outcomes: ['Permanent fat mass reduction', 'Increased lean muscle tissue', 'Healed relationship with food', 'Restored metabolic flexibility'],
  },
  {
    id: '04',
    programNumber: 'PROGRAM 04',
    title: 'Hormonal Harmony',
    subtitle: 'PCOD Management →',
    category: 'PCOD & HORMONE MANAGEMENT',
    description: 'Restore your cycle. Reclaim your energy.',
    phases: [
      { label: 'PHASE 01', title: 'Map — Endocrinological baseline', items: ['Comprehensive hormone panel', 'Cortisol curve analysis', 'Thyroid function testing', 'Symptom severity mapping', 'PCOS phenotype identification', 'Root-cause & androgen profiling'] },
      { label: 'PHASE 02', title: 'Balance — Targeted interventions', items: ['Seed cycling & cycle syncing', 'Inflammation-lowering diet', 'Stress mitigation techniques', 'Targeted peptide & supplement therapy', 'Anti-inflammatory cooking workshop', 'Kitchen & pantry transformation'] },
      { label: 'PHASE 03', title: 'Thrive — Natural rhythm integration', items: ['Predictable menstrual cycles', 'Sustained energy protocols', 'Fertility optimization (if desired)', 'Long-term hormonal resilience', 'Exercise independence training', 'Mindfulness & emotional balance'] },
    ],
    pathways: [
      { id: 'c', name: 'Androgen Phenotype', duration: '9 Months', description: 'Acne · Hair growth · Hormonal balance', price: '₹1,20,000' },
      { id: 'd', name: 'Cycle Phenotype', duration: '9 Months', description: 'Regular periods · Ovulation · Fertility', price: '₹1,20,000' },
      { id: 'ab', name: 'Metabolic Phenotype', duration: '12 Months', description: 'insulin resistance, weight gain or difficulty losing weight, irregular periods, skin changes like dark patches', price: '₹1,60,000' }
    ],
    outcomes: ['Regulated natural cycles', 'Cleared hormonal acne', 'Eliminated chronic fatigue', 'Balanced mood & emotional stability', 'Improved energy within weeks', 'Sustainable hormonal health for life'],
  },
  {
    id: '05',
    programNumber: 'PROGRAM 05',
    title: 'The Liver Renewal Protocol',
    subtitle: 'Liver Detoxification →',
    category: 'LIVER DETOXIFICATION & REPAIR',
    description: 'Reverse the damage. Rebuild from within.',
    phases: [
      { label: 'PHASE 01', title: 'Assess — Hepatic function review', items: ['Liver enzyme panels (ALT/AST)', 'Fatty liver ultrasound grading', 'Toxin exposure questionnaire', 'Metabolic syndrome screening', 'Liver stage mapping (F0–F4)', 'Fibrosis risk assessment (FIB-4)'] },
      { label: 'PHASE 02', title: 'Cleanse — Deep cellular repair', items: ['Targeted lipotropic nutrients', 'Elimination of hepatic stressors', 'Phase 1 & 2 detox support', 'Fructose & alcohol restriction', 'Nutrition & kitchen transformation', 'Daily accountability & fortnightly plan updates'] },
      { label: 'PHASE 03', title: 'Protect — Lifelong hepatic health', items: ['Antioxidant-rich dietary shifts', 'Maintenance supplement protocol', 'Routine enzyme monitoring', 'Sustainable lifestyle boundaries', 'Exercise independence training', 'Lifelong maintenance blueprint'] },
    ],
    pathways: [
      { id: 'path-a', name: 'Path A: Early Stage (F0–F1)', duration: '6 Months', description: 'Fatty liver, no major scarring. Complete reversal achievable.', price: '₹1,00,000' },
      { id: 'path-b', name: 'Path B: Moderate Stage (F2–F3)', duration: '6 Months', description: 'Moderate to advanced fibrosis. Measurable recovery in 70%+ patients.', price: '₹1,60,000' },
      { id: 'path-c', name: 'Path C: Advanced Stage (F4)', duration: '6 Months', description: 'Cirrhosis stage. Reduce complications, improve quality of life significantly.', price: '₹2,10,000' }
    ],
    outcomes: ['Reversed fatty liver markers', 'Normalized liver enzymes', 'Enhanced natural detoxification', 'Reduced systemic inflammation', 'Improved energy & metabolic health', 'Sustainable liver protection for life'],
  },
  {
    id: '06',
    programNumber: 'PROGRAM 06',
    title: 'Metabolic Reawakening',
    subtitle: 'Marker Correction →',
    category: 'CLINICAL MARKER CORRECTION',
    description: 'One protocol. Every marker, corrected.',
    phases: [
      { label: 'PHASE 01', title: 'Audit — The dysregulation report', items: ['Lipid panel deep dive', 'Inflammatory markers (hs-CRP)', 'Homocysteine & nutrient checks', 'Cardiovascular risk assessment', 'Metabolic staging & root-cause mapping', 'Blood pressure & sugar dysregulation review'] },
      { label: 'PHASE 02', title: 'Target — Precision lifestyle medicine', items: ['ApoB lowering strategies', 'Endothelial function repair', 'Evidence-based nutraceuticals', 'Targeted cardiovascular exercise', 'Nutrition workshop & kitchen audit', 'Habit-building & daily accountability'] },
      { label: 'PHASE 03', title: 'Secure — Bulletproof bloodwork', items: ['Optimal range maintenance', 'Quarterly comparative labs', 'Dietary flexibility integration', 'Long-term risk mitigation', 'Exercise independence training', 'Mindfulness & stress correction'] },
    ],
    customSections: [
      { title: 'YOUR 12-MONTH ARC', items: ['Month 1 — Discover your stage & roadmap', 'Months 2–4 — Reset habits, early results begin', 'Months 5–8 — Rebuild metabolism, visible progress', 'Months 9–12 — Master & sustain long-term transformation'] },
    ],
    pathways: [
      { id: 'ind', name: 'Stages (0-4)', duration: '12 Months', description: 'Individual metabolic syndrome correction program.', price: '₹1,60,000' },
      { id: 'couple', name: 'Both in program (any stage)', duration: '12 Months', description: 'Couple Pricing.', price: '₹2,80,000' }
    ],
    outcomes: ['Optimized lipid profiles', 'Lowered inflammatory markers', 'Reduced cardiovascular risk', 'Crystal-clear laboratory results', 'Improved blood pressure, sugar & cholesterol', 'Sustainable metabolic freedom for life'],
  },
  {
    id: '07',
    programNumber: 'PROGRAM 07',
    title: 'The Thyroid Renaissance',
    subtitle: 'Thyroid Management →',
    category: 'THYROID OPTIMIZATION PROGRAM',
    description: 'Restore your thyroid. Reclaim your energy. Redefine your life.',
    price: '₹1,60,000',
    phases: [
      { label: 'PHASE 01', title: 'Awaken — Full thyroid & root cause assessment', items: ['Free T3, Free T4, Reverse T3', 'Thyroid antibody screening', 'Iodine & selenium levels', 'Basal body temperature tracking', 'Stage mapping (T0–T4)', 'Phenotype identification (A/B/C/D)'] },
      { label: 'PHASE 02', title: 'Reset — Deep hormonal restoration', items: ['Autoimmune trigger removal', 'Gut-thyroid axis healing', 'Thyroid-specific nutrition protocol', 'Stress-induced suppression repair', 'Kitchen & metabolic audit', 'Culinary & nutrition coaching'] },
      { label: 'PHASE 03', title: 'Rebuild — Metabolic & lifestyle stabilization', items: ['Exercise independence training', 'Mindfulness & stress care', 'Mid-program clinical assessment', 'Continuous plan optimization', 'Sustained energy & weight stabilization', 'Restored hair, skin & body warmth'] },
      { label: 'PHASE 04', title: 'Mastery — Lifelong thyroid freedom', items: ['Final assessment & transformation report', 'Personalized thyroid blueprint', 'Graduation & long-term integration', 'Consistent daily energy flow', 'Lifetime maintenance protocol'] },
    ],
    outcomes: ['Optimal T3 conversion', 'Reduced autoimmune antibodies', 'Eliminated cold intolerance', 'Restored metabolic speed', 'Improved energy, sleep & focus', 'Sustainable weight management'],
  },
  {
    id: '08',
    programNumber: 'PROGRAM 08',
    title: 'The Kitchen Cure',
    subtitle: 'Culinary Intelligence →',
    category: 'CULINARY INTELLIGENCE PROGRAM',
    description: 'Your home is your first clinic. We transform it.',
    phases: [
      { label: 'PHASE 01', title: 'Audit — Assess your kitchen & habits', items: ['In-home kitchen audit', 'Cooking method assessment', 'Ingredient & pantry review', 'Health condition mapping'] },
      { label: 'PHASE 02', title: 'Transform — Rebuild your food environment', items: ['Smart ingredient substitutions', 'Condition-specific meal plans', 'Live culinary training session', 'Practical cooking techniques'] },
      { label: 'PHASE 03', title: 'Sustain — Make healthy cooking permanent', items: ['Seasonal menu planning', 'Follow-up culinary review', 'Grocery & sourcing guidance', 'Long-term kitchen blueprint'] },
    ],
    outcomes: ['A kitchen built for healing', 'Sustainable healthy cooking', 'No more restrictive diets', 'Condition-specific nutrition'],
  },
];

const Modal = ({ program, onClose }) => {
  const [selectedPathway, setSelectedPathway] = useState(null);

  React.useEffect(() => {
    if (program?.pathways) {
      setSelectedPathway(program.pathways[0]);
    } else {
      setSelectedPathway(null);
    }
  }, [program]);

  if (!program) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12"
        style={{ background: 'rgba(6,41,38,0.55)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl shadow-2xl"
          style={{ background: '#fff', border: `1px solid ${C.border}` }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-lg transition-colors z-10"
            style={{ border: `1px solid ${C.border}`, color: C.muted }}
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="p-8 md:p-12 pb-6 md:pb-8" style={{ borderBottom: `1px solid ${C.border}` }}>
            <p className="font-bold text-xs tracking-widest uppercase mb-3" style={{ color: C.accent }}>
              {program.category}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight" style={{ color: C.primary }}>
              {program.title}
            </h2>
            <p className="text-lg italic" style={{ color: C.muted }}>
              {program.description}
            </p>
          </div>

          {/* Phases */}
          <div className="p-8 md:p-12 flex flex-col gap-10" style={{ borderBottom: `1px solid ${C.border}` }}>
            {program.phases.map((phase, idx) => (
              <div key={idx} className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div
                    className="w-max px-3 py-1 rounded text-xs font-bold tracking-widest uppercase"
                    style={{ background: C.accent, color: '#fff' }}
                  >
                    {phase.label}
                  </div>
                  <h3 className="text-lg md:text-xl font-medium" style={{ color: C.primary }}>
                    {phase.title}
                  </h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 pl-1 sm:pl-0">
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.accent }} />
                      <span className="text-sm md:text-base leading-relaxed" style={{ color: C.muted }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Custom Sections */}
          {program.customSections && program.customSections.map((section, secIdx) => (
            <div key={secIdx} className="p-8 md:p-12" style={{ borderBottom: `1px solid ${C.border}` }}>
              <h3 className="font-bold text-xs tracking-widest uppercase mb-6" style={{ color: C.muted }}>
                {section.title}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.border, opacity: 0.6 }} />
                    <span className="text-sm md:text-base leading-relaxed" style={{ color: C.primary }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Pathways Selector */}
          {program.pathways && (
            <div className="p-8 md:p-12" style={{ borderBottom: `1px solid ${C.border}` }}>
              <h3 className="font-bold text-xs tracking-widest uppercase mb-6" style={{ color: C.muted }}>
                PROGRAM PATHWAYS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {program.pathways.map((pathway) => {
                  const isActive = selectedPathway?.id === pathway.id;
                  return (
                    <button
                      key={pathway.id}
                      onClick={() => setSelectedPathway(pathway)}
                      className="flex-1 p-4 rounded-xl text-left transition-all duration-200 border"
                      style={{
                        backgroundColor: isActive ? `${C.accent}15` : 'transparent',
                        borderColor: isActive ? C.accent : C.border,
                      }}
                    >
                      <div className="font-bold text-lg mb-1" style={{ color: C.primary }}>
                        {pathway.name}
                      </div>
                      <div className="text-sm font-medium mb-1" style={{ color: C.accent }}>
                        {pathway.duration}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {selectedPathway && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FBFB', border: `1px solid ${C.border}` }}>
                  <div className="flex items-start gap-3">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.accent }} />
                    <span className="text-sm md:text-base leading-relaxed" style={{ color: C.primary }}>
                      {selectedPathway.description}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Outcomes */}
          <div className="p-8 md:p-12" style={{ borderBottom: `1px solid ${C.border}` }}>
            <h3 className="font-bold text-xs tracking-widest uppercase mb-6" style={{ color: C.muted }}>
              YOUR OUTCOMES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {program.outcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}25` }}
                >
                  <Check size={16} style={{ color: C.accent }} className="shrink-0" />
                  <span className="text-sm" style={{ color: C.primary }}>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: `${C.bg}CC` }}
          >
            <div className="flex flex-col gap-1 text-center sm:text-left">
              {(selectedPathway?.price || program.price) ? (
                <p className="font-bold text-xl md:text-2xl" style={{ color: C.primary }}>
                  {selectedPathway?.price || program.price}
                </p>
              ) : (
                <p className="font-bold text-lg md:text-xl" style={{ color: C.primary }}>
                  Consult for Pricing
                </p>
              )}
              <p className="text-xs font-sans mt-0.5" style={{ color: C.muted }}>
                Strictly limited intake. Supervised by Dr. Divya Gautam.
              </p>
            </div>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: C.accent, color: '#fff', boxShadow: `0 4px 15px ${C.accent}40` }}
            >
              Apply for Early Access →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Services = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  React.useEffect(() => {
    document.body.style.overflow = selectedProgram ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedProgram]);

  return (
    <main
      className="w-full min-h-screen pt-[110px] md:pt-[140px] pb-32 px-6 md:px-12 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
    >
      {/* Header */}
      <motion.div
        className="max-w-6xl mx-auto flex flex-col items-start gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-[0.15em] uppercase"
          style={{ border: `1px solid ${C.accent}40`, background: `${C.accent}15`, color: C.accent }}
        >
          Clinical Programs
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]" style={{ color: C.primary }}>
          Evidence-Based<br className="hidden md:block" />{' '}
          <span style={{ color: C.accent }}>Clinical Services.</span>
        </h1>
        <p className="text-base md:text-lg leading-relaxed max-w-2xl mt-2" style={{ color: C.muted }}>
          Every program is completely personalized and strictly designed to identify and correct the root causes of disease, ensuring long-term vitality.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {servicesData.map((program, idx) => (
          <motion.div
            key={program.id}
            onClick={() => setSelectedProgram(program)}
            className="group cursor-pointer rounded-2xl p-6 flex flex-col justify-between min-h-[160px] transition-all duration-300"
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4, boxShadow: `0 12px 30px ${C.accent}20` }}
          >
            <div>
              <p className="font-sans text-xs tracking-widest mb-2" style={{ color: C.muted }}>
                {program.programNumber}
              </p>
              <h3 className="font-medium text-lg lg:text-xl leading-tight" style={{ color: C.primary }}>
                {program.title}
              </h3>
            </div>
            <p
              className="text-xs mt-6 tracking-wide group-hover:translate-x-1 transition-transform"
              style={{ color: C.accent }}
            >
              {program.subtitle}
            </p>
          </motion.div>
        ))}
      </div>

      <Modal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
    </main>
  );
};

export default Services;
