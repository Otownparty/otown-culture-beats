import { useEffect, useRef, useState } from "react";

const phrases = [
  { text: "This is Otown Party!!", start: 0.0, end: 3.2, hero: true },
  { text: "We are more than an Experience.", start: 3.2, end: 6.0, emphasize: "Experience" },
  { text: "We are a Wave.", start: 6.0, end: 8.4 },
  { text: "A Movement.", start: 8.4, end: 10.6 },
  { text: "A Culture.", start: 10.6, end: 12.8 },
  { text: "Otown Party Welcomes You.", start: 12.8, end: 16.0, finale: true },
];

const TOTAL = 16000;
const SESSION_KEY = "otown_intro_seen";

const IntroSplash = ({ onDone }: { onDone: () => void }) => {
  const [t, setT] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [muted, setMuted] = useState(false);
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
        }, 1200);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Try playing with sound first; fall back to muted if browser blocks autoplay.
    const v = videoRef.current;
    if (v) {
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    }
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const unmute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    v.play().catch(() => {});
    setMuted(false);
  };

  const tSec = t / 1000;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        exiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      {/* Background video — fully crisp, no filters */}
      <video
        ref={videoRef}
        src="/intro-bg.mp4"
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle dark overlay for text legibility only */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Warm accent glow */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 65%, hsl(20 90% 55% / 0.45), transparent 55%)",
        }}
      />

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay film-grain" />

      {/* Text — upper area above stage, fully responsive */}
      <div className="absolute inset-x-0 top-0 h-[44vh] flex items-center justify-center px-4 sm:px-6">
        <div className="relative w-full max-w-5xl h-[8rem] sm:h-[9rem] md:h-[10rem]">
          {phrases.map((p, i) => {
            const dur = p.end - p.start;
            const localT = (tSec - p.start) / dur;
            const visible = localT > -0.05 && localT < 1.05;
            if (!visible) return null;

            const IN = 0.22;
            const OUT = 0.74;
            let opacity = 1;
            let translateY = 0;
            let blurAmt = 0;
            let scaleExtra = 0;

            if (localT < IN) {
              const k = Math.max(0, localT) / IN;
              const eased = 1 - Math.pow(1 - k, 3);
              opacity = eased;
              translateY = (1 - eased) * 18;
              blurAmt = (1 - eased) * 6;
            } else if (localT > OUT) {
              const k = Math.min(1, (localT - OUT) / (1 - OUT));
              const eased = k * k;
              opacity = 1 - eased;
              translateY = -eased * 14;
              blurAmt = eased * 4;
              scaleExtra = eased * 0.04;
            }

            const baseScale = p.finale ? 1 + Math.min(1, Math.max(0, localT)) * 0.06 : 1;
            const tracking = p.hero || p.finale ? 0.14 : 0.18;

            return (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center text-center will-change-transform"
                style={{
                  transform: `translateY(${translateY}px) scale(${baseScale + scaleExtra})`,
                  opacity,
                  filter: `blur(${blurAmt}px)`,
                  transition: "opacity 80ms linear, filter 120ms linear",
                }}
              >
                <h1
                  className="uppercase text-balance break-words"
                  style={{
                    fontFamily: p.hero || p.finale
                      ? "'Cinzel', 'Cormorant Garamond', serif"
                      : "'Italiana', 'Cormorant Garamond', serif",
                    fontWeight: p.hero || p.finale ? 700 : 400,
                    fontStyle: p.hero || p.finale ? "normal" : "italic",
                    letterSpacing: `${tracking}em`,
                    lineHeight: 1.1,
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(180deg, #fff 0%, #fff 55%, hsl(36 85% 70%) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    fontSize: p.hero
                      ? "clamp(1.6rem, 7.5vw, 4rem)"
                      : p.finale
                      ? "clamp(1.4rem, 6.5vw, 3.4rem)"
                      : "clamp(1.1rem, 5.2vw, 2.6rem)",
                    textShadow:
                      "0 0 32px hsl(20 95% 55% / 0.45), 0 2px 22px rgba(0,0,0,0.7)",
                    filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.5))",
                    paddingInline: "0.25em",
                  }}
                >
                  {p.emphasize ? (
                    <>
                      {p.text.split(p.emphasize)[0]}
                      <span
                        style={{
                          fontStyle: "italic",
                          backgroundImage:
                            "linear-gradient(120deg, hsl(36 95% 62%), hsl(15 90% 60%))",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {p.emphasize}
                      </span>
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

      {/* Tap-to-unmute hint if browser blocked audio */}
      {muted && !exiting && (
        <button
          onClick={unmute}
          className="absolute bottom-6 right-6 z-10 text-xs sm:text-sm tracking-[0.25em] uppercase text-white/85 border border-white/30 hover:border-white/70 hover:text-white px-4 py-2 rounded-full backdrop-blur-sm bg-black/30 transition"
          aria-label="Unmute intro sound"
        >
          ♪ Tap for sound
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
    </div>
  );
};

export const shouldShowIntro = () =>
  typeof window !== "undefined" && !sessionStorage.getItem(SESSION_KEY);

export default IntroSplash;
