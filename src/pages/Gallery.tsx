import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
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

type Photo = { src: string; alt: string; era: string };

const photos: Photo[] = [
  { src: g1, alt: "Flag waving in the crowd", era: "recent" },
  { src: g2, alt: "Friends vibing in traditional attire", era: "recent" },
  { src: g3, alt: "Smiles under the lights", era: "recent" },
  { src: g4, alt: "DJ behind the decks", era: "early" },
  { src: g5, alt: "Crowd energy from the stage", era: "recent" },
  { src: g6, alt: "Night panorama under the palms", era: "rise" },
  { src: g7, alt: "Fashion moment at the rave", era: "rise" },
  { src: g8, alt: "Team members in the crowd", era: "recent" },
  { src: g9, alt: "Dancing under red lights", era: "early" },
  { src: g10, alt: "Lost in the music", era: "rise" },
  { src: g11, alt: "Tie-dye fashion under the lights", era: "early" },
  { src: g12, alt: "Massive crowd under amber glow", era: "recent" },
  { src: g13, alt: "Cool vibes in black and white", era: "rise" },
  { src: g14, alt: "Pure rave energy", era: "rise" },
  { src: g15, alt: "Smiling at the LED pyramid", era: "recent" },
  { src: g16, alt: "Bold fashion statements", era: "recent" },
  { src: g17, alt: "Otown Party neon sign", era: "rise" },
  { src: g18, alt: "Couple feeling the music", era: "early" },
  { src: g19, alt: "Sea of ravers under spotlight", era: "recent" },
  { src: g20, alt: "Shades and vibes", era: "rise" },
  { src: g21, alt: "DJs on the POTY stage", era: "recent" },
  { src: g22, alt: "Dancing queens on stage", era: "early" },
  { src: g23, alt: "Haunted Groove edition style", era: "rise" },
  { src: g24, alt: "Crowd view from backstage", era: "recent" },
  { src: g25, alt: "Smooth moves on the dance floor", era: "recent" },
  { src: g26, alt: "Styled up on stage", era: "rise" },
  { src: g27, alt: "Aerial view of the rave", era: "rise" },
  { src: g28, alt: "Leopard print at the pyramid", era: "recent" },
  { src: g29, alt: "Drip duo at the light-up sign", era: "early" },
  { src: g30, alt: "Black and white crowd panorama", era: "early" },
  { src: g31, alt: "Red carpet at the Haunted Groove", era: "rise" },
  { src: g32, alt: "Red beret fashion moment", era: "recent" },
  { src: g33, alt: "Stage performance under coloured lights", era: "recent" },
  { src: g34, alt: "Percussionist on stage", era: "recent" },
  { src: g35, alt: "Crowd under blue lights", era: "rise" },
  { src: g36, alt: "Squad goals at the sign", era: "early" },
  { src: g37, alt: "Female DJ in the zone", era: "early" },
  { src: g38, alt: "MC commanding the crowd", era: "rise" },
];

const filters = [
  { label: "All Editions", value: "all" },
  { label: "Early Years", value: "early" },
  { label: "The Rise", value: "rise" },
  { label: "Recent", value: "recent" },
];

const Gallery = () => {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.era === filter);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox((i) => (i !== null && i > 0 ? i - 1 : filtered.length - 1)), [filtered.length]);
  const next = useCallback(() => setLightbox((i) => (i !== null && i < filtered.length - 1 ? i + 1 : 0)), [filtered.length]);

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
        <div className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center" onClick={close}>
          <button onClick={close} className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors" aria-label="Close"><X size={28} /></button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-foreground hover:text-primary transition-colors" aria-label="Previous"><ChevronLeft size={36} /></button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-foreground hover:text-primary transition-colors" aria-label="Next"><ChevronRight size={36} /></button>
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
