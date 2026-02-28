import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const occasions = [
  { name: 'Wedding Guest', slug: 'wedding', image: 'https://images.unsplash.com/photo-1759906760638-eeffcb471e53?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBpbmRpYW4lMjBmYXNoaW9uJTIwb3V0Zml0JTIwd2VkZGluZyUyMGd1ZXN0JTIwc2FyZWUlMjBsZWhlbmdhJTIwZnVzaW9ufGVufDB8fHx8MTc3MjI2MDAyNHww&ixlib=rb-4.1.0&q=85&w=800' },
  { name: 'Evening', slug: 'evening', image: 'https://images.unsplash.com/photo-1767790693645-2373e54d4f02?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBpbmRpYW4lMjBmYXNoaW9uJTIwb3V0Zml0JTIwd2VkZGluZyUyMGd1ZXN0JTIwc2FyZWUlMjBsZWhlbmdhJTIwZnVzaW9ufGVufDB8fHx8MTc3MjI2MDAyNHww&ixlib=rb-4.1.0&q=85&w=800' },
  { name: 'Vacation', slug: 'vacation', image: 'https://images.unsplash.com/photo-1669197800714-2dc0c62b7c09?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwzfHxoaWdoJTIwZmFzaGlvbiUyMGVkaXRvcmlhbCUyMGluZGlhbiUyMHdvbWFuJTIwYmVpZ2UlMjBpdm9yeSUyMHdhcm0lMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcyMjYwMDEzfDA&ixlib=rb-4.1.0&q=85&w=800' },
  { name: 'Festive', slug: 'festive', image: 'https://images.unsplash.com/photo-1755223738124-9aa6f5ea763f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMGVkaXRvcmlhbCUyMGluZGlhbiUyMHdvbWFuJTIwYmVpZ2UlMjBpdm9yeSUyMHdhcm0lMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcyMjYwMDEzfDA&ixlib=rb-4.1.0&q=85&w=800' },
  { name: 'Brunch', slug: 'brunch', image: 'https://images.unsplash.com/photo-1740198827446-08055241eb87?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHw0fHxoaWdoJTIwZmFzaGlvbiUyMGVkaXRvcmlhbCUyMGluZGlhbiUyMHdvbWFuJTIwYmVpZ2UlMjBpdm9yeSUyMHdhcm0lMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcyMjYwMDEzfDA&ixlib=rb-4.1.0&q=85&w=800' }
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, designersRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/designers`)
        ]);
        setProducts(productsRes.data.slice(0, 8));
        setDesigners(designersRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/newsletter?email=${email}`);
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[90vh] overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img 
            src="https://static.prod-images.emergentagent.com/jobs/7baedaea-0ab9-44bd-88d4-20dcd8858633/images/246354e3ba15da855fb16b35af84e39d442c064089808cb265b50fb21562d52c.png"
            alt="Closetory - Luxury Walk-in Closet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        </div>
        
        <div className="relative h-full flex items-end">
          <div className="max-w-[1600px] mx-auto px-8 pb-24 w-full">
            <h1 className="font-display text-5xl md:text-7xl mb-6 max-w-3xl" data-testid="hero-heading">
              Every Closet Has a Story.
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
              India's most compelling emerging labels under one thoughtfully edited roof. Outfits that speak—with intention, craftsmanship, and confidence.
            </p>
            <div className="flex gap-6">
              <Link to="/shop">
                <Button className="rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90" data-testid="explore-button">
                  Explore the Edit
                </Button>
              </Link>
              <Link to="/designers">
                <Button variant="outline" className="rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-6 border-primary hover:bg-primary/10" data-testid="designers-button">
                  Discover Designers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <p className="font-accent text-lg italic text-muted-foreground mb-2">Curated for You</p>
          <h2 className="font-display text-4xl md:text-5xl">Featured Edit</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="featured-products">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/shop">
            <Button variant="outline" className="rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-4" data-testid="view-all-button">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-8 py-24" data-testid="shop-by-occasion">
        <div className="text-center mb-16">
          <p className="font-accent text-lg italic text-muted-foreground mb-2">Find Your Moment</p>
          <h2 className="font-display text-4xl md:text-5xl">Shop by Occasion</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {occasions.map((occasion) => (
            <Link
              key={occasion.slug}
              to={`/shop?occasion=${occasion.slug}`}
              className="group relative aspect-[3/4] overflow-hidden border border-border/50 hover:border-accent/30 transition-colors duration-500"
              data-testid={`occasion-${occasion.slug}`}
            >
              <img 
                src={occasion.image}
                alt={occasion.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl text-primary-foreground">{occasion.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/30 py-24">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <p className="font-accent text-lg italic text-muted-foreground mb-2">Our Makers</p>
            <h2 className="font-display text-4xl md:text-5xl">Designer Spotlight</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12" data-testid="designer-spotlight">
            {designers.map((designer) => (
              <Link
                key={designer.designer_id}
                to={`/designers`}
                className="group"
                data-testid={`designer-${designer.designer_id}`}
              >
                <div className="aspect-square overflow-hidden border border-border/50 mb-6">
                  <img 
                    src={designer.image}
                    alt={designer.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display text-2xl mb-3">{designer.name}</h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-3">{designer.philosophy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-8 py-24" data-testid="why-closetory">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl mb-12">Why Closetory</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          <div className="text-center">
            <h3 className="font-display text-2xl mb-4">Curated</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              Every piece is handpicked to elevate your wardrobe from ordinary to unforgettable. Silhouettes with intention, designs with depth.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-display text-2xl mb-4">Cultured</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              We celebrate designs that carry culture, character, and confidence—honoring India's rich textile heritage through contemporary fashion.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-display text-2xl mb-4">Unforgettable</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              Getting dressed isn't just routine—it's storytelling. These outfits make statements that resonate and memories that last.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-24">
        <div className="max-w-[800px] mx-auto px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-6">Join Our Story</h2>
          <p className="font-body text-muted-foreground mb-8 text-lg">
            Be the first to discover new designers, exclusive collections, and styling inspiration.
          </p>
          <form onSubmit={handleNewsletter} className="flex gap-4 max-w-md mx-auto" data-testid="newsletter-form">
            <Input 
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary font-body"
              data-testid="newsletter-email-input"
            />
            <Button type="submit" className="rounded-sm uppercase tracking-widest font-medium text-xs px-8" data-testid="newsletter-submit">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;