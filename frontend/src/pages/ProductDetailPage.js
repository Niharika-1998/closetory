import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/products/${id}`);
        setProduct(response.data);
        
        if (response.data.designer_id) {
          const designerRes = await axios.get(`${API}/designers/${response.data.designer_id}`);
          setDesigner(designerRes.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await axios.delete(`${API}/wishlist/${product.product_id}`, { withCredentials: true });
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(`${API}/wishlist/${product.product_id}`, {}, { withCredentials: true });
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${API}/cart/${product.product_id}`, {}, { withCredentials: true });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen" data-testid="product-detail-page">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <div className="aspect-[3/4] overflow-hidden border border-border/50 mb-6">
              <img 
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden border ${selectedImage === index ? 'border-accent' : 'border-border/50'} hover:border-accent/50 transition-colors`}
                    data-testid={`product-thumbnail-${index}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <p className="font-accent text-lg italic text-muted-foreground mb-2">{product.category}</p>
              <h1 className="font-display text-4xl md:text-5xl mb-4" data-testid="product-name">{product.name}</h1>
              <p className="font-display text-3xl text-accent" data-testid="product-price">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            {designer && (
              <div>
                <p className="font-body text-sm uppercase tracking-wide mb-2">Label Name</p>
                <p className="font-display text-xl">{designer.name}</p>
              </div>
            )}

            {product.label_url && (
              <div>
                <a 
                  href={product.label_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button 
                    variant="outline"
                    className="rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-4 border-primary hover:bg-primary/10"
                    data-testid="view-on-label-site"
                  >
                    View on Label's Website
                  </Button>
                </a>
              </div>
            )}

            <div>
              <p className="font-body text-sm uppercase tracking-wide mb-3">Description</p>
              <p className="font-body text-muted-foreground leading-relaxed" data-testid="product-description">{product.description}</p>
            </div>

            {product.fabric && (
              <div>
                <p className="font-body text-sm uppercase tracking-wide mb-3">Fabric & Craftsmanship</p>
                <p className="font-body text-muted-foreground leading-relaxed">{product.fabric}</p>
              </div>
            )}

            {product.styling_notes && (
              <div>
                <p className="font-body text-sm uppercase tracking-wide mb-3">Styling Notes</p>
                <p className="font-body text-muted-foreground leading-relaxed">{product.styling_notes}</p>
              </div>
            )}

            {product.curation_note && (
              <div className="bg-secondary/30 p-8">
                <p className="font-body text-sm uppercase tracking-wide mb-3">Why We Curated This</p>
                <p className="font-accent text-lg italic text-muted-foreground">{product.curation_note}</p>
              </div>
            )}

            <div className="flex gap-4 pt-8">
              {product.label_url ? (
                <a 
                  href={product.label_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    className="w-full rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="view-on-label-site-main"
                  >
                    View on Label's Website
                  </Button>
                </a>
              ) : (
                <Button 
                  disabled
                  className="flex-1 rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-6"
                >
                  Coming Soon
                </Button>
              )}
              <Button 
                onClick={handleWishlist}
                variant="outline"
                className="rounded-sm px-6 py-6 border-primary hover:bg-primary/10"
                data-testid="wishlist-button"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-accent text-accent' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;