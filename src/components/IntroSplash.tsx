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
        }, 1100);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const v = videoRef.current;
    const tryUnmute = () => {
      if (!v) return;
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {});
    };
    if (v) {
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {
        // Browser blocked unmuted autoplay — start muted, then unmute on first interaction.
        v.muted = true;
        v.play().catch(() => {});
        const onInteract = () => {
          tryUnmute();
          window.removeEventListener("pointerdown", onInteract);
          window.removeEventListener("keydown", onInteract);
          window.removeEventListener("touchstart", onInteract);
        };
        window.addEventListener("pointerdown", onInteract, { once: true });
        window.addEventListener("keydown", onInteract, { once: true });
        window.addEventListener("touchstart", onInteract, { once: true });
      });
    }
    return () => cancelAnimationFrame(raf);
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

      {/* Tap-to-unmute hint if browser blocked audio */}
      {muted && !exiting && (
        <button
          onClick={unmute}
          className="absolute bottom-6 right-6 z-10 text-xs sm:text-sm tracking-[0.25em] uppercase text-foreground/85 border border-foreground/30 hover:border-primary hover:text-primary px-4 py-2 rounded-full backdrop-blur-sm bg-background/40 transition font-display"
          aria-label="Unmute intro sound"
        >
          ♪ Tap for sound
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
    </div>
  );
};

export const shouldShowIntro = () =>
  typeof window !== "undefined" && !sessionStorage.getItem(SESSION_KEY);

export default IntroSplash;
