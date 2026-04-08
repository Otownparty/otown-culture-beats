import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import aboutImg from "@/assets/about-party.jpg";

const values = [
  { num: "01", title: "Culture First", desc: "Every decision honours African culture — in sound, style, and space." },
  { num: "02", title: "Community", desc: "Building belonging where every raver feels seen and celebrated." },
  { num: "03", title: "Excellence", desc: "Premium production, world-class curation, relentless attention to detail." },
  { num: "04", title: "Expression", desc: "Fashion, art, music — a canvas for unfiltered African self-expression." },
];

const About = () => (
  <>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">About</p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-16">The Movement</h1>
        </ScrollReveal>

        {/* Origin */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <ScrollReveal>
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Where It All Began</h2>
              <p className="text-muted-foreground leading-relaxed">
                Otown Party was born from a desire to create a space where African urban culture could breathe freely — where music, fashion, and community converge without compromise. What started as an intimate gathering has grown into one of the most anticipated events on the African rave calendar.
              </p>
              <h2 className="text-2xl font-display font-bold text-foreground pt-4">More Than a Party — A Cultural Statement</h2>
              <p className="text-muted-foreground leading-relaxed">
                Otown Party exists to celebrate, amplify, and preserve African urban culture. Music is the universal language through which we build community — every beat, every lyric, every moment on the dancefloor is a declaration of identity.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden">
              <img src={aboutImg} alt="Otown Party atmosphere" className="w-full h-full object-cover" loading="lazy" width={1024} height={1024} />
            </div>
          </ScrollReveal>
        </div>

        {/* Milestone */}
        <ScrollReveal>
          <div className="bg-card border border-border border-l-4 border-l-primary rounded-xl p-8 mb-20">
            <h3 className="text-xl font-display font-bold text-foreground mb-2">10 Successful Editions and Growing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Reaching 10 editions is not just a number — it is proof that African urban culture is a force that unites, inspires, and endures. Each edition has been a chapter in a story that continues to unfold.
            </p>
          </div>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8">Our Values</h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <ScrollReveal key={v.num}>
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all">
                <span className="text-primary font-display font-bold text-sm">{v.num}</span>
                <h3 className="font-display font-bold text-lg text-foreground mt-2 mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default About;
