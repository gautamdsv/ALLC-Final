import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export const AppleCardsCarousel = ({ items }) => {
  const carouselRef = useRef(null);


  const drag = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    rafId: null,
  });


  const onMouseDown = (e) => {
    const el = carouselRef.current;
    cancelMomentum();

    drag.current.isDown = true;
    drag.current.startX = e.pageX - el.offsetLeft;
    drag.current.scrollLeft = el.scrollLeft;
    drag.current.lastX = e.pageX;
    drag.current.lastTime = Date.now();
    drag.current.velocity = 0;

    el.style.cursor = "grabbing";
    el.style.scrollSnapType = "none"; // disable snap while dragging
  };

  const onMouseMove = (e) => {
    if (!drag.current.isDown) return;
    e.preventDefault();

    const el = carouselRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = x - drag.current.startX;


    const now = Date.now();
    const dt = now - drag.current.lastTime;
    if (dt > 0) {
      drag.current.velocity = (e.pageX - drag.current.lastX) / dt;
    }
    drag.current.lastX = e.pageX;
    drag.current.lastTime = now;

    el.scrollLeft = drag.current.scrollLeft - walk;
  };

  const onMouseUp = () => {
    if (!drag.current.isDown) return;
    drag.current.isDown = false;
    const el = carouselRef.current;
    el.style.cursor = "grab";
    startMomentum();
  };

  const onMouseLeave = () => {
    if (!drag.current.isDown) return;
    drag.current.isDown = false;
    const el = carouselRef.current;
    el.style.cursor = "grab";
    startMomentum();
  };


  const onTouchStart = (e) => {
    const el = carouselRef.current;
    cancelMomentum();

    drag.current.isDown = true;
    drag.current.startX = e.touches[0].pageX - el.offsetLeft;
    drag.current.scrollLeft = el.scrollLeft;
    drag.current.lastX = e.touches[0].pageX;
    drag.current.lastTime = Date.now();
    drag.current.velocity = 0;

    el.style.scrollSnapType = "none";
  };

  const onTouchMove = (e) => {
    if (!drag.current.isDown) return;

    const el = carouselRef.current;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = x - drag.current.startX;

    const now = Date.now();
    const dt = now - drag.current.lastTime;
    if (dt > 0) {
      drag.current.velocity = (e.touches[0].pageX - drag.current.lastX) / dt;
    }
    drag.current.lastX = e.touches[0].pageX;
    drag.current.lastTime = now;

    el.scrollLeft = drag.current.scrollLeft - walk;
  };

  const onTouchEnd = () => {
    drag.current.isDown = false;
    startMomentum();
  };


  const startMomentum = () => {
    const el = carouselRef.current;
    let velocity = drag.current.velocity * -18; // scale & invert direction
    const friction = 0.92;
    const minVelocity = 0.5;

    const tick = () => {
      if (Math.abs(velocity) < minVelocity) {
        el.style.scrollSnapType = "";
        return;
      }
      el.scrollLeft += velocity;
      velocity *= friction;
      drag.current.rafId = requestAnimationFrame(tick);
    };

    drag.current.rafId = requestAnimationFrame(tick);
  };

  const cancelMomentum = () => {
    if (drag.current.rafId) {
      cancelAnimationFrame(drag.current.rafId);
      drag.current.rafId = null;
    }
  };

  useEffect(() => () => cancelMomentum(), []);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={carouselRef}
        className="flex w-full overflow-x-scroll overscroll-x-none py-8 sm:py-10 md:py-20 [scrollbar-width:none] [-ms-overflow-style:none] snap-x snap-proximity cursor-grab"
        style={{ WebkitOverflowScrolling: "touch" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex flex-row justify-start gap-4 sm:gap-6 md:gap-10 pl-4 sm:pl-6 md:pl-12 max-w-none min-w-min">
          {items.map((item, index) => (
            <Card key={index} item={item} index={index} />
          ))}
          <div className="w-8 md:w-20 shrink-0" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
    </div>
  );
};

export const Card = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[2.5rem] md:rounded-[3rem] h-[240px] sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[600px] w-[calc(100vw-40px)] sm:w-[280px] md:w-[350px] lg:w-[450px] shrink-0 overflow-hidden snap-center md:snap-start group hover:-translate-y-2 transition-transform duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.15)] origin-bottom"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.9)] via-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.1)] z-10 pointer-events-none" />
      <img
        src={item.src}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
        draggable={false}
      />

      <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end">
        <div className="mb-4 inline-block backdrop-blur-md bg-white/10 border border-white/20 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full w-fit">
          <p className="text-white font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px] md:text-xs">
            {item.category}
          </p>
        </div>
        <h3
          className="text-white font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-bold leading-tight drop-shadow-lg"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-3 sm:mt-4 text-white/90 text-xs sm:text-sm md:text-lg leading-relaxed opacity-0 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 hidden md:block">
            {item.description}
          </p>
        )}
      </div>

      {item.icon && (
        <div className="absolute top-8 right-8 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white transform translate-x-4 group-hover:translate-x-0">
          {item.icon}
        </div>
      )}
    </motion.div>
  );
};
