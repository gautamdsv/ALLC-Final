import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedNumber = ({ value, duration = 2, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const animateNumber = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // easeOutExpo
      const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setDisplayValue(Math.floor(easeProgress * value));

      if (progress < duration * 1000) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayValue(value);
      }
    };

    const timeout = setTimeout(() => {
      requestAnimationFrame(animateNumber);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, duration, delay]);

  return <span>{displayValue}</span>;
};

const WaitlistMeter = () => {
  return (
    <div className="w-full rounded-xl p-6 flex flex-col gap-5 mt-4 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(6,41,38,0.12)', backdropFilter: 'blur(12px)' }}>

      <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full pointer-events-none" style={{ background: 'rgba(42,181,165,0.12)' }} />

      <div className="flex justify-between items-center z-10">
        <h4 className="font-bold text-lg" style={{ color: '#062926' }}>Cohort 01 Capacity</h4>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2AB5A5' }} />
            <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase" style={{ color: '#2AB5A5' }}>Live Metric</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 z-10">
        <div className="w-full flex justify-between items-end">
            <span className="font-sans text-xs uppercase tracking-wider font-bold" style={{ color: '#4A7C78' }}>Allocations Reserved</span>
            <span className="font-mono font-bold" style={{ color: '#062926' }}><AnimatedNumber value={42} duration={2} delay={0.2} /> / 50</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(6,41,38,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #2AB5A5, #062926)' }}
              initial={{ width: 0 }}
              animate={{ width: "84%" }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2 z-10">
        <div className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: 'rgba(42,181,165,0.08)', border: '1px solid rgba(42,181,165,0.2)' }}>
            <span className="font-sans text-[0.6rem] uppercase tracking-widest font-bold" style={{ color: '#4A7C78' }}>Seats Remaining</span>
            <span className="font-bold text-4xl leading-none" style={{ color: '#2AB5A5' }}>
                <AnimatedNumber value={8} duration={2.5} delay={0.4} />
            </span>
        </div>
        
        <div className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: 'rgba(6,41,38,0.05)', border: '1px solid rgba(6,41,38,0.1)' }}>
            <span className="font-sans text-[0.6rem] uppercase tracking-widest font-bold" style={{ color: '#4A7C78' }}>Applications (24h)</span>
            <span className="font-bold text-4xl leading-none" style={{ color: '#062926' }}>
                <AnimatedNumber value={142} duration={3} delay={0.2} />
            </span>
        </div>
      </div>
      
    </div>
  );
};

export default WaitlistMeter;
