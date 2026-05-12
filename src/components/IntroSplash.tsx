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
    videoRef.current?.play().catch(() => {});
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const tSec = t / 1000;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        exiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      {/* Background video — crisp, no blur */}
      <video
        ref={videoRef}
        src="/intro-bg.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "saturate(1.08) contrast(1.05)", transform: "scale(1.04)" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.95) 100%)",
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
      <div className="absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay film-grain" />

      {/* Text — positioned in upper black area above the stage */}
      <div className="absolute inset-x-0 top-0 h-[42vh] flex items-center justify-center px-6">
        <div className="relative w-full max-w-4xl h-[6rem] sm:h-[7.5rem]">
          {phrases.map((p, i) => {
            const dur = p.end - p.start;
            const localT = (tSec - p.start) / dur;
            const visible = localT > -0.05 && localT < 1.05;
            if (!visible) return null;

            // Slow, cinematic in/out — 22% in, 26% out, long hold
            const IN = 0.22;
            const OUT = 0.74;
            let opacity = 1;
            let translateY = 0; // px
            let blurAmt = 0;
            let scaleExtra = 0;

            if (localT < IN) {
              const k = Math.max(0, localT) / IN;
              const eased = 1 - Math.pow(1 - k, 3); // easeOutCubic
              opacity = eased;
              translateY = (1 - eased) * 18;
              blurAmt = (1 - eased) * 6;
            } else if (localT > OUT) {
              const k = Math.min(1, (localT - OUT) / (1 - OUT));
              const eased = k * k; // easeInQuad — slow start, gentle fade
              opacity = 1 - eased;
              translateY = -eased * 14;
              blurAmt = eased * 4;
              scaleExtra = eased * 0.04;
            }

            const baseScale = p.finale ? 1 + Math.min(1, Math.max(0, localT)) * 0.06 : 1;
            const tracking = p.hero ? 0.08 + Math.min(1, Math.max(0, localT)) * 0.06 : 0.14;

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
                  className="font-bold text-white uppercase whitespace-nowrap"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                    fontWeight: 500,
                    fontStyle: "italic",
                    letterSpacing: `${tracking}em`,
                    fontSize: p.hero
                      ? "clamp(1.75rem, 6vw, 3.75rem)"
                      : "clamp(1.25rem, 4.2vw, 2.6rem)",
                    textShadow:
                      "0 0 28px hsl(20 95% 55% / 0.4), 0 2px 18px rgba(0,0,0,0.65)",
                  }}
                >
                  {p.emphasize ? (
                    <>
                      {p.text.split(p.emphasize)[0]}
                      <em
                        className="not-italic"
                        style={{
                          fontStyle: "italic",
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
    </div>
  );
};

export const shouldShowIntro = () =>
  typeof window !== "undefined" && !sessionStorage.getItem(SESSION_KEY);

export default IntroSplash;
