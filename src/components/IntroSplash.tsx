import { useEffect, useRef, useState } from "react";

const phrases = [
  { text: "This is Otown Party!!", start: 0.2, end: 2.9, hero: true },
  { text: "We are more than an Experience.", start: 2.9, end: 5.3, emphasize: "Experience" },
  { text: "We are a Wave.", start: 5.3, end: 7.3 },
  { text: "A Movement.", start: 7.3, end: 9.1 },
  { text: "A Culture.", start: 9.1, end: 10.9 },
  { text: "Otown Party Welcomes You.", start: 10.9, end: 13.6, finale: true },
];

const TOTAL = 13800;
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
          
          onDone();
        }, 1100);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Clear any legacy "seen" flag so the intro always re-plays on refresh.
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}

    const v = videoRef.current;
    const tryUnmute = () => {
      if (!v) return;
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {});
      // Reflect actual state on next tick (iOS may keep it muted silently).
      setTimeout(() => setMuted(!!v.muted), 60);
    };

    const onInteract = () => {
      tryUnmute();
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("click", onInteract);
    };
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("touchstart", onInteract);
    window.addEventListener("keydown", onInteract);
    window.addEventListener("click", onInteract);

    if (v) {
      v.muted = false;
      v.volume = 1;
      v.play()
        .then(() => setTimeout(() => setMuted(!!v.muted), 80))
        .catch(() => {
          v.muted = true;
          setMuted(true);
          v.play().catch(() => {});
        });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("click", onInteract);
    };
  }, [onDone]);

  const tSec = t / 1000;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background overflow-hidden transition-all duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        exiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      {/* Background video — fully crisp */}
      <video
        ref={videoRef}
        src="/intro-bg.mp4"
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Brand-aligned gold accent glow */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, hsl(var(--gold) / 0.55), transparent 60%)",
        }}
      />

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay film-grain" />

      {/* Text — upper area, fully responsive */}
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
              blurAmt = (1 - eased) * 5;
            } else if (localT > OUT) {
              const k = Math.min(1, (localT - OUT) / (1 - OUT));
              const eased = k * k;
              opacity = 1 - eased;
              translateY = -eased * 14;
              blurAmt = eased * 4;
              scaleExtra = eased * 0.04;
            }

            const baseScale = p.finale ? 1 + Math.min(1, Math.max(0, localT)) * 0.05 : 1;
            const tracking = p.hero || p.finale ? 0.12 : 0.16;

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
                  className="uppercase text-balance break-words font-display"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: p.hero || p.finale ? 800 : 600,
                    letterSpacing: `${tracking}em`,
                    lineHeight: 1.1,
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 100%) 50%, hsl(var(--gold)) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    fontSize: p.hero
                      ? "clamp(1.6rem, 7.2vw, 3.8rem)"
                      : p.finale
                      ? "clamp(1.4rem, 6.2vw, 3.2rem)"
                      : "clamp(1.1rem, 5vw, 2.5rem)",
                    textShadow:
                      "0 0 28px hsl(var(--gold) / 0.5), 0 2px 22px rgba(0,0,0,0.7)",
                    filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.5))",
                    paddingInline: "0.25em",
                  }}
                >
                  {p.emphasize ? (
                    <>
                      {p.text.split(p.emphasize)[0]}
                      <span
                        style={{
                          backgroundImage:
                            "linear-gradient(120deg, hsl(var(--gold)), hsl(var(--pink)))",
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

      {/* Premium "Tap for sound" pill — appears only when audio is muted */}
      {muted && !exiting && (
        <button
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = false;
            v.volume = 1;
            v.play().catch(() => {});
            setTimeout(() => setMuted(!!v.muted), 60);
          }}
          aria-label="Tap to enable sound"
          className="group absolute left-1/2 bottom-8 sm:bottom-10 -translate-x-1/2 z-20 animate-fade-in"
        >
          <span
            className="relative flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-display text-[0.7rem] sm:text-xs uppercase tracking-[0.32em] text-foreground/95 backdrop-blur-xl bg-background/30 border border-foreground/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] hover:shadow-[0_0_28px_hsl(var(--gold)/0.35)]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(var(--gold) / 0.08), hsl(var(--pink) / 0.05))",
            }}
          >
            {/* pulsing dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--gold))] opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--gold))]" />
            </span>
            {/* speaker icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            >
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <span>Tap for sound</span>
          </span>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
    </div>
  );
};

export const shouldShowIntro = () => true;

export default IntroSplash;
