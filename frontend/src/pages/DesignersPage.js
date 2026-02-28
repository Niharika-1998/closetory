import { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DesignersPage = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const response = await axios.get(`${API}/designers`);
        setDesigners(response.data);
      } catch (error) {
        console.error('Error fetching designers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigners();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="designers-page">
      <section className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <p className="font-accent text-lg italic text-muted-foreground mb-2">The Makers</p>
          <h1 className="font-display text-5xl md:text-6xl mb-6">Our Designers</h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the visionaries behind every piece. Each designer brings a unique perspective, blending heritage with contemporary design.
          </p>
        </div>

        {designers.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">No designers available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-16" data-testid="designers-grid">
            {designers.map((designer) => (
              <div key={designer.designer_id} className="group" data-testid={`designer-card-${designer.designer_id}`}>
                <div className="aspect-[4/5] overflow-hidden border border-border/50 mb-8">
                  <img 
                    src={designer.image}
                    alt={designer.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-3xl mb-2">{designer.name}</h2>
                    <p className="font-accent italic text-muted-foreground">{designer.signature_style}</p>
                  </div>

                  <div>
                    <h3 className="font-body text-sm uppercase tracking-wide mb-3">The Story</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">{designer.story}</p>
                  </div>

                  <div>
                    <h3 className="font-body text-sm uppercase tracking-wide mb-3">Philosophy</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">{designer.philosophy}</p>
                  </div>

                  <a 
                    href={`/shop?designer_id=${designer.designer_id}`}
                    className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-wide text-accent hover:text-accent/80 transition-colors"
                    data-testid={`view-collection-${designer.designer_id}`}
                  >
                    View Collection <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DesignersPage;