import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const DesktopTimelineFeatures = ({
  items,
  colors,
  scrollDistance = "450vh",
  entranceTopPosition = "35vh",
  entranceTagBottomMargin = "24px",
  entranceTitleBottomMargin = "32px",
  nodeIconBottomMargin = "40px",
  nodeTagBottomMargin = "16px",
  nodeTitleBottomMargin = "24px"
}) => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile-aware animation constants
  const ANIMATION_Y_OFFSET = isMobile ? -60 : -120;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  const titleOpacity = useTransform(smoothProgress, [0.05, 0.15], [1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.15], ["0%", "-50%"]);
  const titlePointerEvents = useTransform(titleOpacity, (o) => o > 0.1 ? 'auto' : 'none');

  const timelineXDesktop = useTransform(smoothProgress, [0.15, 0.3], ["0vw", "25vw"]);
  const timelineOpacity = useTransform(smoothProgress, [0.1, 0.2], [0, 1]);

  const contentOpacity = useTransform(smoothProgress, [0.2, 0.35], [0, 1]);

  const nodeProgress = useTransform(smoothProgress, [0.3, 0.95], [0, items.length - 1]);

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: scrollDistance, backgroundColor: colors.bgAlt }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        <motion.div
          className="absolute z-50 flex flex-col items-center justify-center text-center px-6 w-full max-w-4xl"
          style={{ opacity: titleOpacity, y: titleY, pointerEvents: titlePointerEvents, top: entranceTopPosition }}
        >
          <div
            className="inline-block px-6 py-2 rounded-full shadow-sm"
            style={{
              marginBottom: entranceTagBottomMargin,
              border: `1px solid ${colors.accent}50`,
              backgroundColor: `${colors.accent}10`,
            }}
          >
            <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: colors.accent }}>Our Promise</p>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-serif font-bold leading-[1.1] tracking-tight" style={{ color: colors.primary, marginBottom: entranceTitleBottomMargin }}>
            The Four Pillars <br className="hidden md:block" />of Healing
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto" style={{ color: colors.mutedText, fontWeight: 500 }}>
            Keep scrolling to uncover the architectural foundation of true metabolic reversal and extreme longevity.
          </p>
        </motion.div>

        <motion.div
          className="absolute h-[40vh] md:h-[50vh] lg:h-[60vh] flex flex-col items-center justify-between z-20 w-16"
          style={{ x: timelineXDesktop, opacity: timelineOpacity }}
        >
          <div className="absolute top-[5%] bottom-[5%] w-1 rounded-full" style={{ backgroundColor: 'rgba(8, 28, 21, 0.05)' }} />

          <motion.div
            className="absolute top-[5%] w-1 rounded-full origin-top"
            style={{
              backgroundColor: colors.accent,
              height: "90%",
              scaleY: useTransform(nodeProgress, [0, items.length - 1], [0, 1])
            }}
          />

          {items.map((item, i) => {
            const isActiveState = useTransform(nodeProgress, (p) => {
              const dist = Math.abs(p - i);
              return dist < 0.5 ? 1 : 0;
            });

            const dotColor = useTransform(isActiveState, (active) => active ? colors.accent : "transparent");
            const borderColor = useTransform(isActiveState, (active) => active ? colors.accent : "rgba(8, 28, 21, 0.15)");
            const scale = useTransform(isActiveState, (active) => active ? 1.5 : 1);

            return (
              <div key={i} className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white transition-shadow shadow-sm" style={{ border: 'none' }}>
                <motion.div
                  className="w-5 h-5 rounded-full border-[3px]"
                  style={{ backgroundColor: dotColor, borderColor, scale }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            );
          })}
        </motion.div>

        <motion.div
          className="absolute left-[5%] sm:left-[8%] md:left-[10%] lg:left-[15%] top-1/2 -translate-y-1/2 w-[90%] sm:w-[85%] md:w-[45%] h-auto md:h-[60vh] flex flex-col justify-center z-30"
          style={{ opacity: contentOpacity }}
        >
          {items.map((item, i) => {
            const itemOpacity = useTransform(nodeProgress, (p) => {
              const diff = Math.abs(p - i);
              return Math.max(1 - (diff * 1.5), 0);
            });

            const y = useTransform(nodeProgress, (p) => {
              const diff = p - i;
              return diff * ANIMATION_Y_OFFSET;
            });

            const pointerEvents = useTransform(itemOpacity, (o) => o > 0.5 ? 'auto' : 'none');

            return (
              <motion.div
                key={i}
                className="absolute inset-0 flex flex-col justify-center items-start pt-10 px-4 md:px-0"
                style={{ opacity: itemOpacity, y, pointerEvents }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] shrink-0" style={{ backgroundColor: item.iconBg, color: item.iconColor, marginBottom: nodeIconBottomMargin }}>
                  {item.icon}
                </div>
                <div className="inline-block px-4 py-1.5 rounded-full border border-[rgba(8,28,21,0.1)]" style={{ marginBottom: nodeTagBottomMargin }}>
                  <p className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase" style={{ color: colors.accent }}>Cornerstone 0{i + 1}</p>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.1]" style={{ color: colors.primary, marginBottom: nodeTitleBottomMargin }}>{item.title}</h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed" style={{ color: colors.mutedText }}>
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

const MobileTimelineFeatures = ({
  items,
  colors,
  scrollDistance = "250vh",
  entranceTopPosition = "15vh",
  entranceTagBottomMargin = "16px",
  entranceTitleBottomMargin = "24px",
  nodeIconBottomMargin = "24px",
  nodeTagBottomMargin = "12px",
  nodeTitleBottomMargin = "16px"
}) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  const titleOpacity = useTransform(smoothProgress, [0.02, 0.12], [1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.12], ["0%", "-30%"]);
  const titlePointerEvents = useTransform(titleOpacity, (o) => o > 0.1 ? 'auto' : 'none');

  const timelineOpacity = useTransform(smoothProgress, [0.1, 0.2], [0, 1]);
  const timelineY = useTransform(smoothProgress, [0.1, 0.2], ["-20%", "0%"]);

  const contentOpacity = useTransform(smoothProgress, [0.15, 0.25], [0, 1]);

  const nodeProgress = useTransform(smoothProgress, [0.25, 0.95], [0, items.length - 1]);

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: scrollDistance, backgroundColor: colors.bgAlt }}>
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-24 px-6 md:px-12">
        
        <motion.div
          className="absolute z-50 flex flex-col items-center justify-center text-center w-full px-6"
          style={{ opacity: titleOpacity, y: titleY, top: entranceTopPosition, pointerEvents: titlePointerEvents }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-[rgba(244,162,97,0.3)] bg-[rgba(244,162,97,0.05)] shadow-sm" style={{ marginBottom: entranceTagBottomMargin }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: colors.accent }}>Our Promise</p>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-[1.15] tracking-tight" style={{ color: colors.primary, marginBottom: entranceTitleBottomMargin }}>
            The Four Pillars <br/>of Healing
          </h2>
          <p className="text-lg leading-relaxed max-w-sm mx-auto" style={{ color: colors.mutedText, fontWeight: 500 }}>
            Keep scrolling to uncover the architectural foundation of true metabolic reversal.
          </p>
        </motion.div>

        <motion.div
          className="relative w-full max-w-md mt-4 flex flex-col items-center justify-center z-40"
          style={{ opacity: timelineOpacity, y: timelineY }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-[2%] right-[2%] h-[2px] rounded-full" style={{ backgroundColor: 'rgba(8, 28, 21, 0.08)' }} />

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 left-[2%] right-[2%] h-[2px] rounded-full origin-left"
            style={{
              backgroundColor: colors.accent,
              scaleX: useTransform(nodeProgress, [0, items.length - 1], [0, 1])
            }}
          />

          <div className="w-full relative flex items-center justify-between">
            {items.map((item, i) => {
              const isActiveState = useTransform(nodeProgress, (p) => {
                const dist = Math.abs(p - i);
                return dist < 0.5 ? 1 : 0;
              });

              const dotColor = useTransform(isActiveState, (active) => active ? colors.accent : "transparent");
              const borderColor = useTransform(isActiveState, (active) => active ? colors.accent : "rgba(8, 28, 21, 0.15)");
              const scale = useTransform(isActiveState, (active) => active ? 1.3 : 1);

              return (
                <div key={i} className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-shadow shadow-sm" style={{ backgroundColor: colors.bgAlt }}>
                  <motion.div
                    className="w-4 h-4 rounded-full border-[2.5px]"
                    style={{ backgroundColor: dotColor, borderColor, scale }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="relative w-full max-w-md flex-1 mt-12 z-30 flex flex-col"
          style={{ opacity: contentOpacity }}
        >
          {items.map((item, i) => {
            const itemOpacity = useTransform(nodeProgress, (p) => {
              const diff = Math.abs(p - i);
              return Math.max(1 - (diff * 2), 0);
            });

            const y = useTransform(nodeProgress, (p) => {
              const diff = p - i;
              return diff * -40;
            });

            const pointerEvents = useTransform(itemOpacity, (o) => o > 0.5 ? 'auto' : 'none');

            return (
              <motion.div
                key={i}
                className="absolute inset-0 flex flex-col justify-start items-start pt-4"
                style={{ opacity: itemOpacity, y, pointerEvents }}
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] shrink-0" style={{ backgroundColor: item.iconBg, color: item.iconColor, marginBottom: nodeIconBottomMargin }}>
                  {item.icon}
                </div>
                <div className="inline-block px-3 py-1 rounded-full border border-[rgba(8,28,21,0.1)]" style={{ marginBottom: nodeTagBottomMargin }}>
                  <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase" style={{ color: colors.accent }}>Cornerstone 0{i + 1}</p>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-[1.1]" style={{ color: colors.primary, marginBottom: nodeTitleBottomMargin }}>{item.title}</h3>
                <p className="text-base sm:text-lg leading-relaxed" style={{ color: colors.mutedText }}>
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export const TimelineFeatures = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize(); // Initialize state on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    // Only pass data props to mobile. 
    // This allows MobileTimelineFeatures to use its own optimized default sizing 
    // (like 250vh scrollDistance) instead of inheriting Desktop sizes.
    return <MobileTimelineFeatures items={props.items} colors={props.colors} />;
  }
  
  return <DesktopTimelineFeatures {...props} />;
};
