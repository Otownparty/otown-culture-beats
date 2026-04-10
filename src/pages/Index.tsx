            <ScrollReveal>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">The Movement</p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">Africa's Premier Rave Experience</h2>
              <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed">
                What started as a bold vision has grown into 10 iconic editions — each one more electrifying than the last. Otown Party is more than an event. It's a movement.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {teaserCards.map((card) => {
                return (
                  <ScrollReveal key={card.title}>
                    <Link to={card.link} className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
                      <card.icon className="text-primary mb-4" size={28} />
                      <h3 className="font-display font-bold text-lg text-foreground mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore <ArrowRight size={14} />
                      </span>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>

            {/* Stats */}
            <ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-card border border-border rounded-xl p-8 mb-16">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-display font-bold text-primary">{s.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Gallery preview */}
            <ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-lg">
                    <img src={img} alt={`Otown Party moment ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link to="/gallery" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
                  View Full Gallery <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
