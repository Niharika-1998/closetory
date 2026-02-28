import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" data-testid="login-page">
      <div className="max-w-md w-full px-8 text-center space-y-8">
        <div>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Closetory</h1>
          <p className="font-accent text-lg italic text-muted-foreground">
            Every closet has a story.
          </p>
        </div>

        <div className="space-y-6">
          <p className="font-body text-muted-foreground">
            Sign in to save your wishlist, manage your cart, and discover curated pieces from India's emerging designers.
          </p>

          <Button 
            onClick={handleGoogleLogin}
            className="w-full rounded-sm uppercase tracking-widest font-medium text-xs px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="google-login-button"
          >
            Sign in with Google
          </Button>

          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            className="w-full font-body text-muted-foreground hover:text-accent"
            data-testid="browse-button"
          >
            Browse without signing in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;