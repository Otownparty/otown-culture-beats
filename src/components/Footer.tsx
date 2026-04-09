import { Link } from "react-router-dom";
import { Instagram, Youtube } from "lucide-react";
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
                "The Genesis · April 2024",
                "Frenzy Edition · June 2024",
                "Y2K Edition · Sept 2024",
                "Halloween: Terror By Night · Oct 2024",
                "Party of the Year · Dec 2024",
                "XOXO Edition · Feb 2025",
                "Owambe Edition · May 2025",
                "Haunted Groove Halloween · Oct 2025",
                "POTY · Dec 2025",
                "Denim After Dark · March 2026",
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
              {/* Instagram */}
              <a href="https://www.instagram.com/o_town_party?igsh=MWVrNTR2OWViMjl4cg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>

              {/* TikTok */}
              <a href="https://www.tiktok.com/@otown.party?_r=1&_t=ZS-95PD2A5A8wR" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.14a8.16 8.16 0 004.77 1.52V7.2a4.85 4.85 0 01-1-.51z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com/@otownparty?si=HSjtK_yE06ik8Gp1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>

              {/* WhatsApp */}
              <a href="https://chat.whatsapp.com/L1XOSfBpM3uLL8CK07QgZY?mode=gi_t" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
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
