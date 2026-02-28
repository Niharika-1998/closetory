import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-secondary/30 mt-32">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-display text-2xl mb-6">Closetory</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Curated statement outfits from India's most compelling emerging designers.
            </p>
          </div>

          <div>
            <h4 className="font-body text-sm uppercase tracking-wide mb-6">Shop</h4>
            <ul className="space-y-3 font-body text-sm">
              <li><Link to="/shop" className="text-muted-foreground hover:text-accent transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-sm uppercase tracking-wide mb-6">Company</h4>
            <ul className="space-y-3 font-body text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-sm uppercase tracking-wide mb-6">Connect</h4>
            <a 
              href="https://instagram.com/closetory.cs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-body text-sm"
              data-testid="instagram-link"
            >
              <Instagram className="w-5 h-5" />
              @closetory.cs
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © 2026 Closetory. Every closet has a story.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;