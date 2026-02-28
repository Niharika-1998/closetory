import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WishlistPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${API}/wishlist`, { withCredentials: true });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user, navigate]);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${API}/wishlist/${productId}`, { withCredentials: true });
      setProducts(products.filter(p => p.product_id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(`${API}/cart/${productId}`, {}, { withCredentials: true });
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

  return (
    <div className="min-h-screen" data-testid="wishlist-page">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl mb-4">Your Wishlist</h1>
          <p className="font-body text-lg text-muted-foreground">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'} saved for later
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-body text-lg text-muted-foreground mb-6">Your wishlist is empty</p>
            <Button 
              onClick={() => navigate('/shop')}
              className="rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-4"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="wishlist-items">
            {products.map((product) => (
              <div key={product.product_id} className="group" data-testid={`wishlist-item-${product.product_id}`}>
                <div className="relative overflow-hidden border border-border/50 mb-4">
                  <div className="aspect-[3/4]">
                    <img 
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-accent text-sm italic text-muted-foreground">{product.category}</p>
                    <h3 className="font-display text-lg">{product.name}</h3>
                    <p className="font-body text-sm text-accent">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAddToCart(product.product_id)}
                      className="flex-1 rounded-sm uppercase tracking-widest font-medium text-xs px-4 py-3"
                      data-testid={`add-to-cart-${product.product_id}`}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      onClick={() => handleRemove(product.product_id)}
                      variant="outline"
                      className="rounded-sm px-4 py-3"
                      data-testid={`remove-${product.product_id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;