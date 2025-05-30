
'use client';

import Link from 'next/link';
import { ShoppingCart, User, Package, LogOut, Settings, Truck, Users, SprayCan, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { signOutUser } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ThemeSwitcher from './ThemeSwitcher';
import { useEffect, useState, type FormEvent } from 'react';


export default function Header() {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const isAdmin = currentUser?.email === 'admin@example.com' || currentUser?.email === 'shopcrimsonhouse@gmail.com';
  const isWorker = currentUser?.email === 'worker@example.com';
  
  let userRole: 'admin' | 'worker' | 'customer' | null = null;
  if (currentUser) {
    if (isAdmin) {
      userRole = 'admin';
    } else if (isWorker) {
      userRole = 'worker';
    } else {
      userRole = 'customer';
    }
  }

  const [isClient, setIsClient] = useState(false);
  const [ordersLinkHref, setOrdersLinkHref] = useState('/orders/history');
  const [ordersLinkText, setOrdersLinkText] = useState('Order History');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && currentUser) {
      const lastPlacedOrderId = localStorage.getItem('lastPlacedOrderId');
      if (lastPlacedOrderId) {
        setOrdersLinkHref(`/orders/${lastPlacedOrderId}`);
        setOrdersLinkText('Track Last Order');
      } else {
        setOrdersLinkHref('/orders/history');
        setOrdersLinkText('Order History');
      }
    } else if (!currentUser) {
        setOrdersLinkHref('/orders/history');
        setOrdersLinkText('Order History');
    }
  }, [isClient, currentUser]);


  const handleLogout = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('lastPlacedOrderId'); 
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login'); 
    } catch (error: any) {
      toast({
        title: 'Logout Failed',
        description: error.message || 'An error occurred during logout.',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (email?: string | null) => {
    if (!email) return '';
    return email.charAt(0).toUpperCase();
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex justify-between items-center w-full sm:w-auto mb-2 sm:mb-0">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors flex items-center">
            <SprayCan className="mr-2 h-7 w-7" /> Crimson Cosmetics
          </Link>
          <div className="sm:hidden flex items-center">
            <ThemeSwitcher />
            {loading ? (
              <Button variant="outline" size="icon" disabled className="ml-2">
                <User className="h-5 w-5 animate-pulse" />
              </Button>
            ) : currentUser ? (
               <Button variant="outline" onClick={handleLogout} title="Logout" className="ml-2 flex items-center" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="default" asChild size="icon" className="ml-2">
                <Link href="/login">
                   <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto sm:max-w-xs order-last sm:order-none mt-2 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <nav className="hidden sm:flex items-center space-x-1">
          <Button variant="ghost" asChild className="text-sm">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/cart" className="flex items-center text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="mr-1 h-5 w-5" /> Cart
            </Link>
          </Button>
          
          {currentUser && (
            <Button variant="ghost" asChild size="sm">
              <Link href={ordersLinkHref} className="flex items-center text-foreground hover:text-primary transition-colors">
                <Package className="mr-1 h-5 w-5" /> {ordersLinkText}
              </Link>
            </Button>
          )}

          {userRole === 'admin' && (
            <>
              <Button variant="ghost" asChild size="sm">
                <Link href="/admin/products" className="flex items-center text-foreground hover:text-primary transition-colors">
                  <Settings className="mr-1 h-5 w-5" /> Products
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm">
                <Link href="/admin/workers" className="flex items-center text-foreground hover:text-primary transition-colors">
                  <Users className="mr-1 h-5 w-5" /> Workers
                </Link>
              </Button>
            </>
          )}

          {userRole === 'worker' && (
            <Button variant="ghost" asChild size="sm">
              <Link href="/delivery/dashboard" className="flex items-center text-foreground hover:text-primary transition-colors">
                <Truck className="mr-1 h-5 w-5" /> Delivery Panel
              </Link>
            </Button>
          )}
          
          <ThemeSwitcher />

          {loading ? (
            <Button variant="outline" size="sm" disabled className="px-2">
              <User className="h-5 w-5 animate-pulse" />
            </Button>
          ) : currentUser ? (
            <>
              <Button variant="ghost" asChild size="sm" className="px-2">
                <Link href="#" className="flex items-center text-foreground hover:text-primary transition-colors" onClick={(e) => e.preventDefault()} title={currentUser.email || "User Profile"}>
                   <Avatar className="h-7 w-7 mr-2">
                    {currentUser.photoURL ? (
                      <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || currentUser.email || 'User'} />
                    ) : null}
                    <AvatarFallback>{getInitials(currentUser.email)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate max-w-[100px]">{currentUser.displayName || currentUser.email}</span>
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} title="Logout" className="flex items-center" size="sm">
                <LogOut className="mr-1 h-5 w-5" /> Logout
              </Button>
            </>
          ) : (
            <Button variant="default" asChild size="sm">
              <Link href="/login" className="flex items-center">
                 Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
