import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API}/cart`, { withCredentials: true });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, navigate]);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${API}/cart/${productId}`, { withCredentials: true });
      setCartItems(cartItems.filter(item => item.product_id !== productId));
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="cart-page">
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl mb-4">Your Cart</h1>
          <p className="font-body text-lg text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-body text-lg text-muted-foreground mb-6">Your cart is empty</p>
            <Button 
              onClick={() => navigate('/shop')}
              className="rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-4"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8" data-testid="cart-items">
              {cartItems.map((item) => (
                <div 
                  key={item.product_id} 
                  className="flex gap-6 pb-8 border-b border-border/30"
                  data-testid={`cart-item-${item.product_id}`}
                >
                  <div className="w-32 h-40 border border-border/50 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="font-accent text-sm italic text-muted-foreground">{item.category}</p>
                      <h3 className="font-display text-xl">{item.name}</h3>
                      <p className="font-body text-accent">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-border/50 rounded-sm">
                        <button className="p-2 hover:bg-secondary transition-colors" disabled>
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-body px-4">{item.quantity}</span>
                        <button className="p-2 hover:bg-secondary transition-colors" disabled>
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <Button 
                        onClick={() => handleRemove(item.product_id)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        data-testid={`remove-${item.product_id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="font-body text-lg">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary/30 p-8 space-y-6 sticky top-24">
                <h2 className="font-display text-2xl">Order Summary</h2>
                
                <div className="space-y-3 font-body">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span data-testid="cart-subtotal">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border/30 pt-3 flex justify-between text-lg font-display">
                    <span>Total</span>
                    <span data-testid="cart-total">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-6"
                  data-testid="proceed-to-checkout"
                >
                  Proceed to Checkout
                </Button>

                <Button 
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="w-full rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-4"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;