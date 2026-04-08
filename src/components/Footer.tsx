import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-muted/30 border-t border-border">
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <img src={logo} alt="Otown Party" className="h-12 w-auto" />
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
            {["The Genesis · 2015", "Rising Energy · 2016", "Golden Era · 2022", "A Decade of Raving · 2024"].map((e) => (
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
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
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

export default Footer;
