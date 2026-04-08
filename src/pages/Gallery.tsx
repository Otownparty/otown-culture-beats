import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import hero from "@/assets/hero-bg.jpg";
import about from "@/assets/about-party.jpg";
import spot from "@/assets/event-spotlight.jpg";

type Photo = { src: string; alt: string; era: string };

const photos: Photo[] = [
  { src: g1, alt: "Crowd dancing under amber lights", era: "early" },
  { src: g2, alt: "Hands raised at the concert", era: "early" },
  { src: g3, alt: "Friends celebrating together", era: "rise" },
  { src: g4, alt: "Stage production with golden lights", era: "rise" },
  { src: hero, alt: "Panoramic concert view", era: "recent" },
  { src: about, alt: "Atmospheric party moment", era: "recent" },
  { src: spot, alt: "DJ performing live", era: "early" },
  { src: g1, alt: "Festival energy captured", era: "rise" },
  { src: g3, alt: "Community and culture", era: "recent" },
  { src: g4, alt: "Light show on stage", era: "early" },
  { src: hero, alt: "Crowd panorama at night", era: "rise" },
  { src: g2, alt: "Silhouettes in golden light", era: "recent" },
  { src: about, alt: "Rave atmosphere", era: "early" },
  { src: spot, alt: "Behind the decks", era: "recent" },
];

const filters = [
  { label: "All Editions", value: "all" },
  { label: "Early Years (2015–2017)", value: "early" },
  { label: "The Rise (2018–2020)", value: "rise" },
  { label: "Recent (2021–2024)", value: "recent" },
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
