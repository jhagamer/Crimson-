import Link from 'next/link';
import { ShoppingCart, User, Package, LogIn, Settings, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  // Mock authentication state
  const isAuthenticated = false; // Set to true to see authenticated links
  const userRole = 'customer'; // 'customer', 'admin', 'delivery'

  return (
    <header className="bg-card border-b border-border shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          Crimson Commerce
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/cart" className="flex items-center text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="mr-1 h-5 w-5" /> Cart
            </Link>
          </Button>
          
          {isAuthenticated && (
            <Button variant="ghost" asChild>
              <Link href="/orders" className="flex items-center text-foreground hover:text-primary transition-colors">
                <Package className="mr-1 h-5 w-5" /> Orders
              </Link>
            </Button>
          )}

          {isAuthenticated && userRole === 'admin' && (
            <Button variant="ghost" asChild>
              <Link href="/admin/products" className="flex items-center text-foreground hover:text-primary transition-colors">
                <Settings className="mr-1 h-5 w-5" /> Admin
              </Link>
            </Button>
          )}

          {isAuthenticated && userRole === 'delivery' && (
            <Button variant="ghost" asChild>
              <Link href="/delivery/dashboard" className="flex items-center text-foreground hover:text-primary transition-colors">
                <Truck className="mr-1 h-5 w-5" /> Delivery
              </Link>
            </Button>
          )}

          {isAuthenticated ? (
            <Button variant="outline" asChild>
              <Link href="/profile" className="flex items-center text-foreground hover:text-primary transition-colors">
                <User className="mr-1 h-5 w-5" /> Profile
              </Link>
            </Button>
          ) : (
            <Button variant="default" asChild>
              <Link href="/login" className="flex items-center">
                <LogIn className="mr-1 h-5 w-5" /> Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
