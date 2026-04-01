import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import WaitlistMeter from '../components/WaitlistMeter';
import { apiPost } from '../lib/api';

const C = {
  bg: '#DCF4F1',
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  surface: 'rgba(255,255,255,0.8)',
  border: 'rgba(6,41,38,0.12)',
};

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [healthVector, setHealthVector] = useState('');
  const [rationale, setRationale] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await apiPost('/api/v1/waitlist', {
        fullName,
        email,
        healthVector: healthVector || undefined,
        rationale,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="w-full min-h-screen pt-[110px] md:pt-[140px] pb-32 px-6 md:px-12 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

        {/* Left Column */}
        <motion.div
          className="flex flex-col items-start gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}30`, color: C.accent }}
          >
            <Lock size={14} />
            <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase">
              COHORT 01 INTAKE CLOSED
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]" style={{ color: C.primary }}>
            Secure Early{' '}
            <span className="block mt-2" style={{ color: C.accent }}>Access.</span>
          </h1>

          <p className="text-base md:text-lg leading-relaxed mt-2" style={{ color: C.primary }}>
            The Asian Lifestyle Longevity Clinic (ALLC) is currently operating in stealth. Our evidence-based protocols rely on highly specific data architecture that limits our clinical capacity.
          </p>
          <p className="text-sm md:text-base leading-relaxed mb-2" style={{ color: C.muted }}>
            We are accepting waitlist applications for our foundational cohort. Placement is evaluated securely based on priority health vectors.
          </p>

          <div
            className="flex rounded-xl p-5 w-full shadow-sm"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            <div className="flex gap-4">
              <ShieldCheck className="mt-0.5 shrink-0" size={24} style={{ color: C.accent }} />
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide" style={{ color: C.primary }}>Encrypted Submission</span>
                <span className="text-xs mt-1.5 leading-snug" style={{ color: C.muted }}>
                  All application data is protected by strict medical confidentiality protocols before transmission.
                </span>
              </div>
            </div>
          </div>

          <div className="w-full mt-2 lg:mt-4">
            <WaitlistMeter />
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          className="flex flex-col w-full relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div
            className="absolute -inset-4 rounded-3xl blur-2xl"
            style={{ background: `${C.accent}18` }}
          />

          <div
            className="relative w-full rounded-[2rem] p-8 md:p-10 shadow-xl"
            style={{ background: 'rgba(255,255,255,0.85)', border: `1px solid ${C.border}`, backdropFilter: 'blur(16px)' }}
          >
            {submitted ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center py-12">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}30` }}
                >
                  <ShieldCheck size={40} style={{ color: C.accent }} />
                </div>
                <h3 className="font-bold text-3xl mb-4" style={{ color: C.primary }}>Application Secured</h3>
                <p className="text-base leading-relaxed max-w-[300px]" style={{ color: C.muted }}>
                  Your waitlist request has been securely encrypted and transmitted to our clinical board. We will reach out when capacity opens.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-widest pl-1" style={{ color: C.accent }}>Legal Name</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-13 rounded-xl px-5 text-sm focus:outline-none transition-all shadow-inner"
                    style={{
                      background: `${C.bg}CC`,
                      border: `1px solid ${C.border}`,
                      color: C.primary,
                      height: '3.25rem',
                    }}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-widest pl-1" style={{ color: C.accent }}>Secure Contact Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-5 text-sm focus:outline-none transition-all shadow-inner"
                    style={{
                      background: `${C.bg}CC`,
                      border: `1px solid ${C.border}`,
                      color: C.primary,
                      height: '3.25rem',
                    }}
                    placeholder="address@domain.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-widest pl-1" style={{ color: C.accent }}>Target Health Vector (Optional)</label>
                  <select
                    value={healthVector}
                    onChange={(e) => setHealthVector(e.target.value)}
                    className="w-full rounded-xl px-5 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                    style={{
                      background: `${C.bg}CC`,
                      border: `1px solid ${C.border}`,
                      color: C.muted,
                      height: '3.25rem',
                    }}
                  >
                    <option value="">Select primary clinical objective</option>
                    <option value="metabolic">Metabolic Reset / Disease Reversal</option>
                    <option value="cognitive">Cognitive Output Optimization</option>
                    <option value="longevity">Long-Term Vitality / Longevity</option>
                    <option value="other">Other Clinical Requirement</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-widest pl-1" style={{ color: C.accent }}>Application Rationale</label>
                  <textarea
                    required
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    className="w-full rounded-xl p-5 text-sm tracking-wide focus:outline-none transition-all shadow-inner resize-none"
                    style={{
                      background: `${C.bg}CC`,
                      border: `1px solid ${C.border}`,
                      color: C.primary,
                      minHeight: '130px',
                    }}
                    placeholder="Briefly state why you are seeking evidence-based lifestyle medicine..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 mt-2 flex items-center justify-center gap-3 group rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:scale-[1.02]"
                  style={{
                    background: C.accent,
                    color: '#fff',
                    boxShadow: `0 8px 25px ${C.accent}40`,
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Waitlist Application'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {submitError && (
                  <p className="text-xs text-center text-red-600">{submitError}</p>
                )}

                <p className="text-[0.6rem] text-center uppercase tracking-widest mt-1" style={{ color: C.muted }}>
                  No availability guarantees for Cohort 02.
                </p>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </main>
  );
};

export default Contact;
