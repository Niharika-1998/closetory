import { Instagram } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen" data-testid="about-page">
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1687405182302-f1b28707c854?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ6NDJ8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYWVzdGhldGljJTIwYmVpZ2UlMjBsaW5lbiUyMGNvdHRvbiUyMGNsb3RoaW5nJTIwcmFjayUyMHN0b3JlJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzcyMjYwMDI1fDA&ixlib=rb-4.1.0&q=85&w=1600"
            alt="About Closetory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
        
        <div className="relative h-full flex items-end">
          <div className="max-w-[1200px] mx-auto px-8 pb-16 w-full">
            <h1 className="font-display text-5xl md:text-7xl">Our Story</h1>
          </div>
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-8 py-24">
        <div className="space-y-12 font-body text-lg leading-relaxed">
          <div>
            <p className="font-accent text-2xl italic text-muted-foreground mb-6">
              Closetory is a curated fashion destination that brings together India's most compelling emerging labels under one thoughtfully edited roof.
            </p>
            <p className="text-muted-foreground">
              In a world of repetitive fast fashion, Closetory celebrates outfits that speak — silhouettes with intention, craftsmanship with depth, and designs that carry culture, character, and confidence.
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl mb-6">Why We Exist</h2>
            <p className="text-muted-foreground mb-4">
              Each piece is handpicked to elevate your wardrobe from ordinary to unforgettable. Because getting dressed isn't just routine — it's storytelling.
            </p>
            <p className="text-muted-foreground">
              Every designer we work with brings something distinct. A signature silhouette. A textile tradition. A modern take on heritage. And when you wear their work, you're not just getting dressed—you're making a statement.
            </p>
          </div>

          <div className="border-l-2 border-accent pl-8 py-4">
            <p className="font-accent text-xl italic">
              "Getting dressed isn't just routine — it's storytelling. And, every closet has a story to tell!"
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl mb-6">Our Mission</h2>
            <p className="text-muted-foreground">
              To discover and spotlight exceptional homegrown designers creating meaningful, luxurious, and fresh fashion. We champion emerging Indian designers who create with intention, craft with precision, and design with soul—one stitch, one story, one stunning outfit at a time.
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl mb-6">Our Vision</h2>
            <p className="text-muted-foreground">
              We envision a world where your wardrobe is a carefully curated edit, not a closet full of impulse buys. Where every outfit you own carries meaning, craftsmanship, and a story worth telling. Where fashion is elevated, intentional, and deeply personal.
            </p>
          </div>

          <div className="bg-secondary/30 p-12 -mx-8 md:mx-0">
            <h2 className="font-display text-3xl mb-6 text-center">Meet the Founder</h2>
            <div className="text-center mb-8">
              <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-6"></div>
              <h3 className="font-display text-2xl mb-2">Priya Sharma</h3>
              <p className="font-accent italic text-muted-foreground">Founder & Creative Director</p>
            </div>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              After years in the fashion industry watching homegrown talent get overshadowed by mass brands, Priya founded Closetory to change the narrative. Her mission: to create a platform where emerging Indian designers could shine and fashion-forward women could discover pieces that truly resonate.
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl mb-6">Connect With Us</h2>
            <p className="text-muted-foreground mb-6">
              Follow our journey as we continue to discover and showcase India's most exciting emerging designers. Join our community of women who dress with intention and style with confidence.
            </p>
            <a 
              href="https://instagram.com/closetory" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-body text-accent hover:text-accent/80 transition-colors"
              data-testid="about-instagram-link"
            >
              <Instagram className="w-6 h-6" />
              <span className="text-lg">@closetory</span>
            </a>
          </div>

          <div className="text-center pt-12">
            <p className="font-display text-3xl">
              Because every closet has a story.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;