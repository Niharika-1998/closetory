import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-md bg-background/80 border-b border-border/20 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-tight" data-testid="logo-link">
            Closetory
          </Link>

          <div className="hidden md:flex items-center gap-12 font-body">
            <Link to="/shop" className="editorial-link text-sm uppercase tracking-wide" data-testid="shop-link">
              Shop
            </Link>
            <Link to="/about" className="editorial-link text-sm uppercase tracking-wide" data-testid="about-link">
              About
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/wishlist" data-testid="wishlist-icon">
              <Heart className="w-5 h-5 hover:text-accent transition-colors duration-300" />
            </Link>
            <Link to="/cart" data-testid="cart-icon">
              <ShoppingBag className="w-5 h-5 hover:text-accent transition-colors duration-300" />
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="user-menu-trigger">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border">
                  <DropdownMenuItem className="font-body">{user.name}</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="font-body" data-testid="logout-button">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" data-testid="login-link">
                <User className="w-5 h-5 hover:text-accent transition-colors duration-300" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;