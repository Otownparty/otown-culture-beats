import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { lastEditionPhotos } from "@/data/lastEditionPhotos";

// ── Archive photos (gallery-1.jpg … gallery-38.jpg) ──────────────────────────
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";
import g9 from "@/assets/gallery-9.jpg";
import g10 from "@/assets/gallery-10.jpg";
import g11 from "@/assets/gallery-11.jpg";
import g12 from "@/assets/gallery-12.jpg";
import g13 from "@/assets/gallery-13.jpg";
import g14 from "@/assets/gallery-14.jpg";
import g15 from "@/assets/gallery-15.jpg";
import g16 from "@/assets/gallery-16.jpg";
import g17 from "@/assets/gallery-17.jpg";
import g18 from "@/assets/gallery-18.jpg";
import g19 from "@/assets/gallery-19.jpg";
import g20 from "@/assets/gallery-20.jpg";
import g21 from "@/assets/gallery-21.jpg";
import g22 from "@/assets/gallery-22.jpg";
import g23 from "@/assets/gallery-23.jpg";
import g24 from "@/assets/gallery-24.jpg";
import g25 from "@/assets/gallery-25.jpg";
import g26 from "@/assets/gallery-26.jpg";
import g27 from "@/assets/gallery-27.jpg";
import g28 from "@/assets/gallery-28.jpg";
import g29 from "@/assets/gallery-29.jpg";
import g30 from "@/assets/gallery-30.jpg";
import g31 from "@/assets/gallery-31.jpg";
import g32 from "@/assets/gallery-32.jpg";
import g33 from "@/assets/gallery-33.jpg";
import g34 from "@/assets/gallery-34.jpg";
import g35 from "@/assets/gallery-35.jpg";
import g36 from "@/assets/gallery-36.jpg";
import g37 from "@/assets/gallery-37.jpg";
import g38 from "@/assets/gallery-38.jpg";

// ── Last Edition photos (keep original filenames in src/assets/) ──────────────
import img4340 from "@/assets/IMG_4340.jpg";
import img4351 from "@/assets/IMG_4351.jpg";
import img4365 from "@/assets/IMG_4365.jpg";
import img4445 from "@/assets/IMG_4445.jpg";
import img4631 from "@/assets/IMG_4631.jpg";
import img4767 from "@/assets/IMG_4767.jpg";
import img4779 from "@/assets/IMG_4779.jpg";
import img4791 from "@/assets/IMG_4791.jpg";
import img4917 from "@/assets/IMG_4917.jpg";
import img4920 from "@/assets/IMG_4920.jpg";
import img4929 from "@/assets/IMG_4929.jpg";
import img4978 from "@/assets/IMG_4978.jpg";
import img4982 from "@/assets/IMG_4982.jpg";
import img4985 from "@/assets/IMG_4985.jpg";
import img5004 from "@/assets/IMG_5004.jpg";
import img5007 from "@/assets/IMG_5007.jpg";
import img5020 from "@/assets/IMG_5020.jpg";
import img5030 from "@/assets/IMG_5030.jpg";
import img5034 from "@/assets/IMG_5034.jpg";
import img5041 from "@/assets/IMG_5041.jpg";
import img5050 from "@/assets/IMG_5050.jpg";
import img5071 from "@/assets/IMG_5071.jpg";
import img5099 from "@/assets/IMG_5099.jpg";
import img5132 from "@/assets/IMG_5132.jpg";
import img5149 from "@/assets/IMG_5149.jpg";
import img5153 from "@/assets/IMG_5153.jpg";
import img5163 from "@/assets/IMG_5163.jpg";
import img5200 from "@/assets/IMG_5200.jpg";
import img5219 from "@/assets/IMG_5219.jpg";
import img5222 from "@/assets/IMG_5222.jpg";
import img5239 from "@/assets/IMG_5239.jpg";
import img5245 from "@/assets/IMG_5245.jpg";
import img5257 from "@/assets/IMG_5257.jpg";
import img5266 from "@/assets/IMG_5266.jpg";
import img5288 from "@/assets/IMG_5288.jpg";
import img5303 from "@/assets/IMG_5303.jpg";
import img5329 from "@/assets/IMG_5329.jpg";
import img5370 from "@/assets/IMG_5370.jpg";
import img5377 from "@/assets/IMG_5377.jpg";
import img5390 from "@/assets/IMG_5390.jpg";
import img5393 from "@/assets/IMG_5393.jpg";
import img5403 from "@/assets/IMG_5403.jpg";
import img5405 from "@/assets/IMG_5405.jpg";
import img5406 from "@/assets/IMG_5406.jpg";
import img5408 from "@/assets/IMG_5408.jpg";
import img5411 from "@/assets/IMG_5411.jpg";
import img5465 from "@/assets/IMG_5465.jpg";
import img5488 from "@/assets/IMG_5488.jpg";

type Photo = { src: string; alt: string; era: string };

const photos: Photo[] = [
  // ── Previous editions (All Editions only) ──────────────────────────────────
  { src: g1,  alt: "Flag waving in the crowd", era: "archive" },
  { src: g2,  alt: "Friends vibing in traditional attire", era: "archive" },
  { src: g3,  alt: "Smiles under the lights", era: "archive" },
  { src: g4,  alt: "DJ behind the decks", era: "archive" },
  { src: g5,  alt: "Crowd energy from the stage", era: "archive" },
  { src: g6,  alt: "Night panorama under the palms", era: "archive" },
  { src: g7,  alt: "Fashion moment at the rave", era: "archive" },
  { src: g8,  alt: "Team members in the crowd", era: "archive" },
  { src: g9,  alt: "Dancing under red lights", era: "archive" },
  { src: g10, alt: "Lost in the music", era: "archive" },
  { src: g11, alt: "Tie-dye fashion under the lights", era: "archive" },
  { src: g12, alt: "Massive crowd under amber glow", era: "archive" },
  { src: g13, alt: "Cool vibes in black and white", era: "archive" },
  { src: g14, alt: "Pure rave energy", era: "archive" },
  { src: g15, alt: "Smiling at the LED pyramid", era: "archive" },
  { src: g16, alt: "Bold fashion statements", era: "archive" },
  { src: g17, alt: "Otown Party neon sign", era: "archive" },
  { src: g18, alt: "Couple feeling the music", era: "archive" },
  { src: g19, alt: "Sea of ravers under spotlight", era: "archive" },
  { src: g20, alt: "Shades and vibes", era: "archive" },
  { src: g21, alt: "DJs on the stage", era: "archive" },
  { src: g22, alt: "Dancing queens on stage", era: "archive" },
  { src: g23, alt: "Haunted Groove edition style", era: "archive" },
  { src: g24, alt: "Crowd view from backstage", era: "archive" },
  { src: g25, alt: "Smooth moves on the dance floor", era: "archive" },
  { src: g26, alt: "Styled up on stage", era: "archive" },
  { src: g27, alt: "Aerial view of the rave", era: "archive" },
  { src: g28, alt: "Leopard print at the pyramid", era: "archive" },
  { src: g29, alt: "Drip duo at the light-up sign", era: "archive" },
  { src: g30, alt: "Black and white crowd panorama", era: "archive" },
  { src: g31, alt: "Red carpet at the Haunted Groove", era: "archive" },
  { src: g32, alt: "Red beret fashion moment", era: "archive" },
  { src: g33, alt: "Stage performance under coloured lights", era: "archive" },
  { src: g34, alt: "Percussionist on stage", era: "archive" },
  { src: g35, alt: "Crowd under blue lights", era: "archive" },
  { src: g36, alt: "Squad goals at the sign", era: "archive" },
  { src: g37, alt: "Female DJ in the zone", era: "archive" },
  { src: g38, alt: "MC commanding the crowd", era: "archive" },

  // ── Last Edition (shows in both All Editions and Last Edition) ──────────────
  { src: img4340, alt: "DJs on stage under red lights", era: "last" },
  { src: img4351, alt: "DJ crew at the decks bathed in red", era: "last" },
  { src: img4365, alt: "Silhouette under golden spotlight", era: "last" },
  { src: img4445, alt: "Full stage panorama under pink lights", era: "last" },
  { src: img4631, alt: "Flag waving over the crowd", era: "last" },
  { src: img4767, alt: "Crowd and stage under purple wash", era: "last" },
  { src: img4779, alt: "Stage energy under teal and yellow beams", era: "last" },
  { src: img4791, alt: "LED screen and performers on stage", era: "last" },
  { src: img4917, alt: "DJ pointing to the crowd from the booth", era: "last" },
  { src: img4920, alt: "Excited performer facing the crowd", era: "last" },
  { src: img4929, alt: "MC in white shirt commanding the crowd", era: "last" },
  { src: img4978, alt: "Wide stage shot with LED visuals", era: "last" },
  { src: img4982, alt: "MC performing under green light beams", era: "last" },
  { src: img4985, alt: "Purple-lit stage with crowd below", era: "last" },
  { src: img5004, alt: "Full stage view under blue night sky", era: "last" },
  { src: img5007, alt: "MC and hype men performing under blue lights", era: "last" },
  { src: img5020, alt: "DJ crew at Pioneer decks under white beams", era: "last" },
  { src: img5030, alt: "DJ booth energy — crew vibing together", era: "last" },
  { src: img5034, alt: "DJs lost in the mix at the Pioneer booth", era: "last" },
  { src: img5041, alt: "Saxophonist and crew on a blue-lit stage", era: "last" },
  { src: img5050, alt: "DJ crew waving flags under warm lights", era: "last" },
  { src: img5071, alt: "Two DJs focused at the Pioneer booth under blue", era: "last" },
  { src: img5099, alt: "Stage and crowd from behind under purple glow", era: "last" },
  { src: img5132, alt: "Performers celebrating on the LED stage", era: "last" },
  { src: img5149, alt: "MC with flag at the decks under blue lights", era: "last" },
  { src: img5153, alt: "DJ crew at the booth under purple wash", era: "last" },
  { src: img5163, alt: "DJ leaning into the decks under purple light", era: "last" },
  { src: img5200, alt: "Performer on stage under yellow beam with crowd", era: "last" },
  { src: img5219, alt: "Flag raised on stage under deep blue light", era: "last" },
  { src: img5222, alt: "Otown Party flag waved toward the crowd", era: "last" },
  { src: img5239, alt: "Aerial view of stage and crowd at night", era: "last" },
  { src: img5245, alt: "Full stage view with LED screens blazing", era: "last" },
  { src: img5257, alt: "DJ and MC at the booth under blue and gold", era: "last" },
  { src: img5266, alt: "DJ raising hand at the decks under yellow light", era: "last" },
  { src: img5288, alt: "Stage crowd view from behind the DJ booth", era: "last" },
  { src: img5303, alt: "Entire crew on stage celebrating", era: "last" },
  { src: img5329, alt: "Crew on stage under full white lighting", era: "last" },
  { src: img5370, alt: "MC performing to massive crowd from the stage", era: "last" },
  { src: img5377, alt: "MC leaning toward the crowd with microphone", era: "last" },
  { src: img5390, alt: "MC in white tracksuit gazing down at the crowd", era: "last" },
  { src: img5393, alt: "MC standing tall on stage amid the haze", era: "last" },
  { src: img5403, alt: "MC surveying the crowd from the stage edge", era: "last" },
  { src: img5405, alt: "MC crouching with mic into the front row", era: "last" },
  { src: img5406, alt: "MC in white performing under stage lights", era: "last" },
  { src: img5408, alt: "Drummer and MC captured from the drum kit", era: "last" },
  { src: img5411, alt: "MC performing under purple stage lights", era: "last" },
  { src: img5465, alt: "MC performing with towel raised over crowd", era: "last" },
  { src: img5488, alt: "MC leaning into mic over a packed crowd", era: "last" },
  // ── Cloudinary-hosted Last Edition photos ──────────────────────────────────
  ...lastEditionPhotos.map((p) => ({ ...p, era: "last" })),
];

const filters = [
  { label: "All Editions", value: "all" },
  { label: "Last Edition", value: "last" },
];

const Gallery = () => {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2500);
  }, []);

  const filtered =
    filter === "all" ? photos : photos.filter((p) => p.era === filter);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i !== null && i > 0 ? i - 1 : filtered.length - 1)),
    [filtered.length]
  );
  const next = useCallback(
    () => setLightbox((i) => (i !== null && i < filtered.length - 1 ? i + 1 : 0)),
    [filtered.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, close, prev, next]);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Gallery</p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">Moments from the Movement</h1>
            <p className="text-muted-foreground max-w-2xl mb-8">A decade of energy, colour, and community — captured one frame at a time.</p>
          </ScrollReveal>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((photo, i) => (
              <ScrollReveal key={`${photo.src}-${i}`}>
                <button
                  onClick={() => setLightbox(i)}
                  className="block w-full overflow-hidden rounded-lg group"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-auto brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-foreground hover:text-primary transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-foreground hover:text-primary transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={36} />
          </button>
          <img
            src={filtered[lightbox].src}
            alt={filtered[lightbox].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </>
  );
};

export default Gallery;
