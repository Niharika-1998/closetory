import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/orders`, {}, { withCredentials: true });
      setOrderId(response.data.order_id);
      setOrderComplete(true);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="order-success">
        <div className="max-w-md text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-accent mx-auto" />
          <h1 className="font-display text-4xl">Order Confirmed!</h1>
          <p className="font-body text-muted-foreground">
            Thank you for your order. Your order ID is <span className="font-display text-accent">{orderId}</span>
          </p>
          <p className="font-body text-sm text-muted-foreground">
            You'll receive a confirmation email shortly with your order details.
          </p>
          <Button 
            onClick={() => navigate('/shop')}
            className="rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-4"
            data-testid="continue-shopping-final"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="checkout-page">
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl mb-4">Checkout</h1>
          <p className="font-body text-lg text-muted-foreground">Complete your purchase</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8" data-testid="checkout-form">
          <div>
            <h2 className="font-display text-2xl mb-6">Shipping Information</h2>
            <div className="space-y-6">
              <div>
                <label className="font-body text-sm uppercase tracking-wide mb-2 block">
                  Full Name *
                </label>
                <Input 
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                  className="border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary font-body"
                  data-testid="checkout-fullname"
                />
              </div>

              <div>
                <label className="font-body text-sm uppercase tracking-wide mb-2 block">
                  Email *
                </label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary font-body"
                  data-testid="checkout-email"
                />
              </div>

              <div>
                <label className="font-body text-sm uppercase tracking-wide mb-2 block">
                  Phone *
                </label>
                <Input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary font-body"
                  data-testid="checkout-phone"
                />
              </div>

              <div>
                <label className="font-body text-sm uppercase tracking-wide mb-2 block">
                  Address *
                </label>
                <Input 
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  className="border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary font-body"
                  data-testid="checkout-address"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="font-body text-sm uppercase tracking-wide mb-2 block">
                    City *
                  </label>
                  <Input 
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                    className="border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary font-body"
                    data-testid="checkout-city"
                  />
                </div>

                <div>
                  <label className="font-body text-sm uppercase tracking-wide mb-2 block">
                    State *
                  </label>
                  <Input 
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                    className="border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary font-body"
                    data-testid="checkout-state"
                  />
                </div>

                <div>
                  <label className="font-body text-sm uppercase tracking-wide mb-2 block">
                    Pincode *
                  </label>
                  <Input 
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    required
                    className="border-b border-border bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary font-body"
                    data-testid="checkout-pincode"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 p-8">
            <h2 className="font-display text-2xl mb-4">Payment Method</h2>
            <p className="font-body text-muted-foreground mb-4">
              This is a demo checkout. No actual payment will be processed.
            </p>
            <div className="border border-border/50 p-4 rounded-sm">
              <p className="font-body text-sm">
                <span className="font-medium">Mock Payment Gateway</span>
                <span className="ml-4 text-muted-foreground">Your order will be confirmed instantly</span>
              </p>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-6"
            data-testid="place-order-button"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;