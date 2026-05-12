import { useEffect, useRef, useState } from "react";

const phrases = [
  { text: "This is Otown Party!!", start: 0, end: 1.5, hero: true },
  { text: "We are more than an Experience.", start: 1.5, end: 2.8, emphasize: "Experience" },
  { text: "We are a Wave!", start: 2.8, end: 3.8 },
  { text: "A Movement.", start: 3.8, end: 4.8 },
  { text: "A Culture.", start: 4.8, end: 5.8 },
  { text: "Otown Party Welcomes You.", start: 5.8, end: 7.0, finale: true },
];

const TOTAL = 7000;
const SESSION_KEY = "otown_intro_seen";

const IntroSplash = ({ onDone }: { onDone: () => void }) => {
  const [t, setT] = useState(0);
  const [exiting, setExiting] = useState(false);
  const startRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let raf: number;
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      setT(elapsed);
      if (elapsed >= TOTAL) {
        setExiting(true);
        setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          onDone();
        }, 900);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    videoRef.current?.play().catch(() => {});
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const tSec = t / 1000;
  // Final phrase: reduce blur from 5px -> 0
  const finalPhase = Math.max(0, Math.min(1, (tSec - 5.8) / 1.2));
  const blurPx = exiting ? 0 : 5 * (1 - finalPhase);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden transition-all duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        exiting ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        src="/intro-bg.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: `blur(${blurPx}px) saturate(1.05)`, transform: "scale(1.08)" }}
      />

      {/* Dark overlay 60% */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Warm accent glow from stage lights */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 65%, hsl(20 90% 55% / 0.55), transparent 55%)",
        }}
      />

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay film-grain" />

      {/* Text — positioned in upper black area above the stage */}
      <div className="absolute inset-x-0 top-0 h-[42vh] flex items-center justify-center px-6">
        <div className="relative w-full max-w-3xl h-[5.5rem] sm:h-[6.5rem] overflow-hidden">
          {phrases.map((p, i) => {
            const active = tSec >= p.start && tSec < p.end;
            const past = tSec >= p.end;
            const future = tSec < p.start;
            const dur = p.end - p.start;
            const localT = Math.max(0, Math.min(1, (tSec - p.start) / dur));

            // tracking expansion for hero
            const tracking = p.hero ? 0.04 + localT * 0.12 : 0.18;
            // scale up final phrase
            const scale = p.finale ? 1 + localT * 0.08 : 1;

            let translateY = "0%";
            let opacity = 1;
            let filter = "blur(0px)";
            if (future) {
              translateY = "110%";
              opacity = 0;
              filter = "blur(12px)";
            } else if (past) {
              translateY = "-110%";
              opacity = 0;
              filter = "blur(12px)";
            } else {
              // active — entering 0..0.18, holding, exiting last 0.18
              if (localT < 0.18) {
                const k = localT / 0.18;
                translateY = `${(1 - k) * 100}%`;
                opacity = k;
                filter = `blur(${(1 - k) * 10}px)`;
              } else if (localT > 0.82) {
                const k = (localT - 0.82) / 0.18;
                translateY = `${-k * 100}%`;
                opacity = 1 - k;
                filter = `blur(${k * 10}px)`;
              }
            }

            return (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center text-center will-change-transform"
                style={{
                  transform: `translateY(${translateY}) scale(${scale})`,
                  opacity,
                  filter,
                  transition: "filter 120ms linear",
                }}
              >
                <h1
                  className="font-display font-bold text-white uppercase whitespace-nowrap"
                  style={{
                    letterSpacing: `${tracking}em`,
                    fontSize: p.hero
                      ? "clamp(1.5rem, 5.5vw, 3.25rem)"
                      : "clamp(1.1rem, 3.8vw, 2.25rem)",
                    textShadow:
                      "0 0 28px hsl(20 95% 55% / 0.35), 0 2px 18px rgba(0,0,0,0.6)",
                  }}
                >
                  {p.emphasize ? (
                    <>
                      {p.text.split(p.emphasize)[0]}
                      <em
                        className="not-italic"
                        style={{
                          background:
                            "linear-gradient(120deg, hsl(36 95% 60%), hsl(15 90% 60%))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {p.emphasize}
                      </em>
                      {p.text.split(p.emphasize)[1]}
                    </>
                  ) : (
                    p.text
                  )}
                </h1>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient to deepen black */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

      {/* Skip */}
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => {
            sessionStorage.setItem(SESSION_KEY, "1");
            onDone();
          }, 600);
        }}
        className="absolute bottom-6 right-6 text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors"
      >
        Skip
      </button>
    </div>
  );
};

export const shouldShowIntro = () =>
  typeof window !== "undefined" && !sessionStorage.getItem(SESSION_KEY);

export default IntroSplash;
