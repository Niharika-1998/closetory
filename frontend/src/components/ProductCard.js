import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist');
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }

    try {
      await axios.post(`${API}/cart/${product.product_id}`, {}, { withCredentials: true });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Link 
      to={`/product/${product.product_id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`product-card-${product.product_id}`}
    >
      <div className="relative overflow-hidden border border-border/50 bg-transparent hover:border-accent/30 transition-colors duration-500">
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-sm hover:bg-accent/20 transition-colors"
          data-testid={`wishlist-button-${product.product_id}`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-accent text-accent' : ''}`} />
        </button>

        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm translate-y-0 transition-transform duration-300">
            <Button 
              onClick={handleAddToCart}
              className="w-full rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid={`add-to-cart-${product.product_id}`}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <p className="font-accent text-sm italic text-muted-foreground">{product.category}</p>
        <h3 className="font-display text-lg">{product.name}</h3>
        <p className="font-body text-sm text-accent">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </Link>
  );
};

export default ProductCard;