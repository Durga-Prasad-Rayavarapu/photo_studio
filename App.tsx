import React, { useState, useEffect, useRef } from "react";
// Added Loader2 to imports from lucide-react
import {
  Camera,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Download,
  Trash2,
  Plus,
  GripVertical,
  User,
  LogIn,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  Lock,
  ArrowDown,
  Loader2,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { StudioHero, StudioGallery } from "./components/StudioScene";
import { QuotationBuilder } from "./components/BillingSystem";
import * as OTPAuth from "otpauth";

const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionButton = motion.button as any;
const MotionSection = motion.section as any;

const ParallaxSection = ({
  children,
  speed = 1,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [150 * speed, -150 * speed]);
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <MotionDiv style={{ y: springY }}>{children}</MotionDiv>
    </div>
  );
};

const FadeInWhenVisible = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </MotionDiv>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const textX = useTransform(scrollYProgress, [0, 1], ["5%", "-25%"]);
  const springTextX = useSpring(textX, { stiffness: 50, damping: 25 });

  const MFA_SECRET = "KRUGS4ZANFZSAYJA";
  const AUTHORIZED_EMAIL = "dsp90322@gmail.com";
  const SESSION_DURATION = 3600000; // 1 hour in milliseconds

  useEffect(() => {
    // Check for existing valid session
    const storedSession = localStorage.getItem("sagar_session");
    if (storedSession) {
      try {
        const { email: storedEmail, expiry } = JSON.parse(storedSession);
        if (Date.now() < expiry && storedEmail === AUTHORIZED_EMAIL) {
          setIsLoggedIn(true);
          setEmail(storedEmail);
        } else {
          localStorage.removeItem("sagar_session");
        }
      } catch (e) {
        localStorage.removeItem("sagar_session");
      }
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleQuotationClick = () => {
    if (isLoggedIn) {
      scrollTo("portal");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    setIsAuthenticating(true);
    await new Promise((r) => setTimeout(r, 1200));

    if (email.toLowerCase() !== AUTHORIZED_EMAIL) {
      setLoginError("Access restricted to authorized personnel only.");
      setIsAuthenticating(false);
      return;
    }
    if (!/^\d{6}$/.test(accessKey)) {
      setLoginError("Invalid format. Enter the 6-digit code.");
      setIsAuthenticating(false);
      return;
    }

    const totp = new OTPAuth.TOTP({
      issuer: "Sagar Photography",
      label: AUTHORIZED_EMAIL,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: MFA_SECRET,
    });

    const delta = totp.validate({ token: accessKey, window: 1 });
    if (delta === null) {
      setLoginError("Verification failed. Code expired or incorrect.");
      setIsAuthenticating(false);
      return;
    }

    // Save session to localStorage for 1 hour
    localStorage.setItem(
      "sagar_session",
      JSON.stringify({
        email: email.toLowerCase(),
        expiry: Date.now() + SESSION_DURATION,
      })
    );

    setIsLoggedIn(true);
    setIsAuthenticating(false);
    setShowLoginModal(false);
    setTimeout(() => scrollTo("portal"), 500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setAccessKey("");
    localStorage.removeItem("sagar_session");
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0A0A0A] text-stone-200 selection:bg-stone-500 selection:text-white overflow-x-hidden"
    >
      {/* GLOBAL PARALLAX BACKGROUND TEXT */}
      <MotionDiv
        style={{ x: springTextX }}
        className="fixed top-1/2 left-0 -translate-y-1/2 whitespace-nowrap pointer-events-none z-0 opacity-[0.03] select-none"
      >
        <span className="font-serif text-[35rem] leading-none text-white font-black tracking-tighter">
          DOCUMENTARY FINEART TIMELESS AUTHENTIC CINEMATIC
        </span>
      </MotionDiv>

      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-black/90 backdrop-blur-2xl py-4 border-b border-white/5"
            : "bg-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-sm group-hover:border-white group-hover:rotate-12 transition-all duration-500">
              <Camera className="text-white" size={20} />
            </div>
            <span className="font-serif text-2xl tracking-tighter text-white uppercase">
              SAGAR
              <span className="font-light italic text-stone-400">
                PHOTOGRAPHY
              </span>
            </span>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400"
          >
            <button
              onClick={() => scrollTo("about")}
              className="hover:text-white transition-colors relative group"
            >
              Vision
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollTo("services")}
              className="hover:text-white transition-colors relative group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollTo("portfolio")}
              className="hover:text-white transition-colors relative group"
            >
              Portfolio
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </button>
            <button
              onClick={handleQuotationClick}
              className="px-7 py-3 bg-white text-black rounded-full hover:bg-stone-200 transition-all transform hover:scale-105 active:scale-95 font-black shadow-xl"
            >
              {isLoggedIn ? "Create Quotation" : "Get Quotation"}
            </button>
          </MotionDiv>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <StudioHero />
          <div className="relative z-10 text-center px-6">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8 inline-flex items-center gap-6 text-stone-400 tracking-[0.5em] uppercase text-[10px] font-black"
            >
              <div className="w-16 h-px bg-stone-700"></div>
              FINE ART WEDDING DOCUMENTARY
              <div className="w-16 h-px bg-stone-700"></div>
            </MotionDiv>

            <div className="mb-12">
              <MotionH1
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-6xl md:text-8xl lg:text-[11rem] text-white leading-[0.8] tracking-tighter"
              >
                <ParallaxSection speed={0.4}>Honoring Your</ParallaxSection>
              </MotionH1>
              <MotionH1
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-serif text-6xl md:text-8xl lg:text-[11rem] text-white leading-[0.8] tracking-tighter"
              >
                <ParallaxSection speed={-0.2}>
                  <span className="italic font-light text-stone-500">
                    Grandest Story.
                  </span>
                </ParallaxSection>
              </MotionH1>
            </div>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center gap-10"
            >
              <button
                onClick={handleQuotationClick}
                className="px-14 py-6 bg-white text-black text-xs font-black uppercase tracking-[0.4em] rounded-full hover:bg-stone-200 transition-all transform hover:-translate-y-2 shadow-2xl active:scale-95"
              >
                Start Your Journey
              </button>

              <button
                onClick={() => scrollTo("about")}
                className="group flex flex-col items-center gap-4 mx-auto animate-bounce mt-4"
              >
                <ArrowDown
                  className="text-stone-500 group-hover:text-white transition-colors"
                  size={20}
                />
              </button>
            </MotionDiv>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          className="py-40 bg-white text-black overflow-hidden relative"
        >
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <ParallaxSection speed={0.5} className="relative z-0">
              <MotionDiv
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[4/5] bg-stone-100 overflow-hidden rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.1)] group cursor-crosshair"
              >
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 bg-stone-100"
                  alt="Sagar Wedding Photography Vision"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
              </MotionDiv>
            </ParallaxSection>

            <div className="relative z-10">
              <FadeInWhenVisible>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-stone-400 mb-8 block">
                  Our Ethos
                </span>
                <h2 className="font-serif text-5xl md:text-7xl mb-12 leading-[1.1] tracking-tight">
                  Preserving the{" "}
                  <span className="italic font-light">
                    soul of every frame.
                  </span>
                </h2>
                <p className="text-xl text-stone-600 font-light leading-relaxed mb-12 max-w-lg">
                  Sagar Photography is a world-class destination studio
                  specializing in the fine art of unscripted moments. We don't
                  just take photos; we document legacies.
                </p>
                <div className="grid grid-cols-2 gap-12 py-10 border-t border-stone-100">
                  <div className="group">
                    <h4 className="font-serif text-4xl mb-2 group-hover:text-stone-500 transition-colors">
                      350+
                    </h4>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-stone-400">
                      Weddings Captured
                    </p>
                  </div>
                  <div className="group">
                    <h4 className="font-serif text-4xl mb-2 group-hover:text-stone-500 transition-colors">
                      15+
                    </h4>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-stone-400">
                      Countries Traversed
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section
          id="services"
          className="py-40 bg-[#0F0F0F] relative overflow-hidden"
        >
          <div className="container mx-auto px-6">
            <FadeInWhenVisible>
              <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-stone-500 mb-6 block">
                    Our Expertise
                  </span>
                  <h2 className="font-serif text-5xl md:text-7xl text-white tracking-tighter">
                    Bespoke{" "}
                    <span className="italic font-light text-stone-600">
                      Collections
                    </span>
                  </h2>
                </div>
                <p className="text-stone-500 text-sm max-w-xs font-light tracking-wide uppercase">
                  Tailored experiences designed to celebrate the unique texture
                  of your love story.
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  title: "The Wedding",
                  img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
                  desc: "Comprehensive cinematic coverage from dawn till the stars emerge.",
                },
                {
                  title: "Pre-Wedding",
                  img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
                  desc: "Editorial engagement sessions in breathtaking global locations.",
                },
                {
                  title: "Bridal Portrait",
                  img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
                  desc: "Intimate, fine-art character studies celebrating elegance.",
                },
              ].map((service, i) => (
                <MotionDiv
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, delay: i * 0.15 }}
                  className="group relative aspect-[3/4] overflow-hidden bg-stone-900 cursor-pointer rounded-sm"
                  onClick={handleQuotationClick}
                >
                  <img
                    src={service.img}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s] bg-stone-800"
                    alt={service.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-12">
                    <h3 className="font-serif text-4xl text-white mb-6 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-stone-400 text-sm leading-relaxed mb-8 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                      {service.desc}
                    </p>
                    <div className="flex items-center gap-5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                      <div className="px-8 py-3 bg-white text-black text-[9px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-stone-200 transition-colors">
                        {isLoggedIn ? "Manage Pro" : "Reserve Quote"}
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section id="portfolio" className="py-40 bg-white">
          <div className="container mx-auto px-6">
            <StudioGallery />
          </div>
        </section>

        {/* QUOTATION PORTAL */}
        <AnimatePresence>
          {isLoggedIn && (
            <MotionSection
              id="portal"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="py-40 bg-[#0A0A0A] border-t border-white/5 overflow-hidden"
            >
              <div className="container mx-auto px-6">
                <div className="animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                    <div>
                      <span className="text-[10px] font-black tracking-[0.5em] uppercase text-stone-600 mb-6 block">
                        Secured Environment
                      </span>
                      <h2 className="font-serif text-6xl text-white tracking-tighter">
                        Pro Workspace
                      </h2>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="group text-stone-500 hover:text-white transition-all flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black bg-white/5 px-6 py-3 rounded-full border border-white/5"
                    >
                      <Trash2
                        size={14}
                        className="group-hover:rotate-12 transition-transform"
                      />{" "}
                      Log Out Workspace
                    </button>
                  </div>
                  <QuotationBuilder />
                </div>
              </div>
            </MotionSection>
          )}
        </AnimatePresence>
      </main>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl"
          >
            <MotionDiv
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-stone-900 border border-white/5 rounded-[2rem] max-w-xl w-full p-12 md:p-16 shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-10 right-10 text-stone-500 hover:text-white hover:rotate-90 transition-all duration-500"
              >
                <X size={28} />
              </button>

              <div className="text-center mb-12">
                <MotionDiv
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 border border-white/10"
                >
                  <Lock size={32} />
                </MotionDiv>
                <h3 className="text-4xl font-serif text-white mb-4 tracking-tight">
                  Access Key Required
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto font-light">
                  Verify your partner identity using Google Authenticator to
                  access professional tools.
                </p>
              </div>

              <div className="space-y-8 text-left">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.4em] font-black text-stone-600 ml-6 mb-3 block">
                    Authorized Email
                  </label>
                  <input
                    type="email"
                    placeholder="dsp90322@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-black/40 border ${
                      loginError.includes("Access")
                        ? "border-red-500/50"
                        : "border-white/10"
                    } rounded-full px-10 py-5 text-white focus:border-white transition-all outline-none text-sm placeholder:text-stone-700`}
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.4em] font-black text-stone-600 ml-6 mb-3 block">
                    Authentication Code
                  </label>
                  <input
                    type="text"
                    placeholder="000 000"
                    maxLength={6}
                    value={accessKey}
                    onChange={(e) =>
                      setAccessKey(e.target.value.replace(/\D/g, ""))
                    }
                    className={`w-full bg-black/40 border ${
                      loginError.includes("failed") ||
                      loginError.includes("format")
                        ? "border-red-500/50"
                        : "border-white/10"
                    } rounded-full px-10 py-5 text-white focus:border-white transition-all outline-none text-center font-mono tracking-[0.8em] text-2xl placeholder:text-stone-800`}
                  />
                </div>

                <AnimatePresence>
                  {loginError && (
                    <MotionDiv
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-3 text-red-400 text-[10px] uppercase tracking-[0.2em] font-black py-2"
                    >
                      <AlertCircle size={14} /> {loginError}
                    </MotionDiv>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleLogin}
                  disabled={isAuthenticating}
                  className="w-full bg-white text-black font-black py-6 rounded-full mt-6 hover:bg-stone-200 transition-all uppercase tracking-[0.5em] text-[11px] flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl active:scale-95"
                >
                  {isAuthenticating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Authorize Access"
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.3em] font-black text-emerald-500/40 pt-4">
                  <ShieldCheck size={14} /> Encrypted Session Active
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <footer className="bg-black text-stone-600 py-32 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-10">
                <Camera size={28} className="text-white" />
                <span className="font-serif text-4xl tracking-tighter text-white">
                  SAGAR
                </span>
              </div>
              <p className="max-w-md text-base leading-relaxed mb-12 font-light text-stone-400">
                Crafting visual legacies for those who value the intersection of
                fine art and cinematic storytelling. Available for commissions
                globally.
              </p>
              <div className="flex gap-6">
                <MotionDiv
                  whileHover={{ y: -5 }}
                  className="p-4 border border-white/5 rounded-full hover:border-white/30 transition-all cursor-pointer"
                >
                  <Instagram size={20} />
                </MotionDiv>
                <MotionDiv
                  whileHover={{ y: -5 }}
                  className="p-4 border border-white/5 rounded-full hover:border-white/30 transition-all cursor-pointer"
                >
                  <Facebook size={20} />
                </MotionDiv>
                <MotionDiv
                  whileHover={{ y: -5 }}
                  className="p-4 border border-white/5 rounded-full hover:border-white/30 transition-all cursor-pointer"
                >
                  <Mail size={20} />
                </MotionDiv>
              </div>
            </div>
            <div>
              <h5 className="text-white text-[10px] tracking-[0.5em] uppercase font-black mb-10">
                Archive
              </h5>
              <ul className="space-y-6 text-sm">
                <li className="hover:text-white transition-all cursor-pointer tracking-wider">
                  The Portfolios
                </li>
                <li className="hover:text-white transition-all cursor-pointer tracking-wider">
                  The Process
                </li>
                <li className="hover:text-white transition-all cursor-pointer tracking-wider">
                  Press & Awards
                </li>
                <li className="hover:text-white transition-all cursor-pointer tracking-wider">
                  Reserve Dates
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white text-[10px] tracking-[0.5em] uppercase font-black mb-10">
                Inquiries
              </h5>
              <p className="text-sm leading-relaxed text-stone-400 mb-8 font-light">
                Direct communications for worldwide scheduling and bespoke
                collections.
              </p>
              <p className="text-white font-serif text-xl italic tracking-wide">
                hello@sagarphoto.com
              </p>
            </div>
          </div>
          <div className="text-[9px] tracking-[0.5em] uppercase text-stone-800 text-center border-t border-white/5 pt-16 font-black">
            &copy; 2024 Sagar Photography Collective. Authenticity in Motion.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
