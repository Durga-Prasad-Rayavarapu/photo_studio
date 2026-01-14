import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const MotionDiv = motion.div as any;

export const StudioHero: React.FC = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  const yBase = useTransform(scrollY, [0, 1000], [0, 500]);
  const y = useSpring(yBase, { stiffness: 40, damping: 20 });
  const scaleBase = useTransform(scrollY, [0, 1000], [1, 1.3]);
  const scale = useSpring(scaleBase, { stiffness: 40, damping: 20 });
  const opacity = useTransform(scrollY, [0, 800], [1, 0.1]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0 w-full h-full overflow-hidden"
    >
      <MotionDiv
        style={{ y, scale, opacity }}
        className="relative w-full h-full"
      >
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover filter brightness-[0.35] bg-stone-900"
          alt="Fine Art Wedding Ceremony"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0A0A0A]"></div>
      </MotionDiv>
      <MotionDiv
        style={{
          y: useSpring(useTransform(scrollY, [0, 1000], [0, -400]), {
            stiffness: 30,
            damping: 15,
          }),
          opacity: useTransform(scrollY, [0, 600], [0.1, 0.5]),
        }}
        className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-stone-100/10 blur-[200px] rounded-full pointer-events-none"
      />
    </div>
  );
};

const GalleryItem = ({ img, index }: { img: any; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Adjusted parallax speed and range to be safer for column layout
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? 40 : -40]),
    { stiffness: 60, damping: 25 }
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

  return (
    <div className="break-inside-avoid mb-24 inline-block w-full">
      <MotionDiv
        ref={ref}
        style={{ y, scale }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative overflow-hidden bg-stone-100 rounded-sm shadow-xl"
      >
        <img
          src={img.src}
          alt={img.title}
          className="w-full h-auto block object-cover transition-transform duration-[2.5s] group-hover:scale-110 bg-stone-200"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 flex items-end p-8 md:p-12 opacity-0 group-hover:opacity-100">
          <div className="text-white">
            <p className="text-[9px] uppercase tracking-[0.4em] mb-3 font-black opacity-60">
              Fine Art Archive
            </p>
            <h4 className="font-serif text-2xl md:text-3xl tracking-tight">
              {img.title}
            </h4>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

export const StudioGallery: React.FC = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
      title: "The Grand Reception",
    },
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200",
      title: "Eternal Promise",
    },
    {
      src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1200",
      title: "Sacred Rings",
    },
    {
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1200",
      title: "The Ethereal Bride",
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200",
      title: "First Dance",
    },
    {
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200",
      title: "The Celebration",
    },
  ];

  return (
    <div className="relative">
      <div className="mb-24 text-center md:text-left">
        <span className="text-[10px] font-black tracking-[0.5em] uppercase text-stone-400 mb-8 block">
          Gallery Portfolio
        </span>
        <h2 className="font-serif text-5xl md:text-8xl text-black tracking-tighter leading-none italic">
          Moments <span className="not-italic text-stone-200">in Motion</span>
        </h2>
      </div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {images.map((img, i) => (
          <GalleryItem key={i} img={img} index={i} />
        ))}
      </div>
    </div>
  );
};
