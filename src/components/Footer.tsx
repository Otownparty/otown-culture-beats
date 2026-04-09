import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/logo-trans.png";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Otown Party" className="h-16 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Africa's premium rave movement. Where culture meets the dancefloor.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-foreground">Navigate</h4>
            <ul className="space-y-2">
              {["Home", "Events", "About", "Gallery", "Tickets"].map((l) => (
                <li key={l}>
                  <Link to={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Past Editions */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-foreground">Past Editions</h4>
            <ul className="space-y-2">
              {[
                "The Genesis · 2024",
                "Frenzy Edition · 2024",
                "Y2K Edition · 2024",
                "Halloween: Terror By Night · 2024",
                "Party of the Year · 2024",
                "XOXO Edition · 2025",
                "Owambe Edition · 2025",
                "Haunted Groove Halloween · 2025",
                "POTY · 2025",
                "Denim After Dark · 2026",
              ].map((e) => (
                <li key={e}>
                  <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">{e}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-foreground">Contact</h4>
            <a href="mailto:hello@otownparty.com" className="text-sm text-muted-foreground hover:text-primary transition-colors block mb-4">
              hello@otownparty.com
            </a>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.14a8.16 8.16 0 004.77 1.52V7.2a4.85 4.85 0 01-1-.51z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Otown Party. All rights reserved.</p>
          <p className="text-xs text-primary font-semibold tracking-wide">Proudly Celebrating African Urban Culture</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
