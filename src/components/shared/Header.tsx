
'use client';

import Link from 'next/link';
import { ShoppingCart, User, Package, LogOut, Settings, Truck, Users, Search, Menu, Bell, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ThemeSwitcher from './ThemeSwitcher';
import { useEffect, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { useSearchVisibility } from '@/contexts/SearchContext'; // Import context hook
import { cn } from '@/lib/utils';


export default function Header() {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { isSearchVisible, setIsSearchVisible, toggleSearch } = useSearchVisibility(); // Use context

  // Admin emails - consider moving to a config or env variable
  const adminEmails = ['jhagamernp098@gmail.com', 'admin@example.com', 'shopcrimsonhouse@gmail.com'];
  const isAdmin = currentUser?.email && adminEmails.includes(currentUser.email);
  const isWorker = currentUser?.email === 'worker@example.com'; // Example, update as needed

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
    if (!supabase) {
      toast({ title: "Logout Failed", description: "Supabase client not initialized.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('lastPlacedOrderId');
      setIsSearchVisible(false); // Hide search on logout
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
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // Optionally hide search after submit: setIsSearchVisible(false);
    }
  };

  const handleAdminMenuToggle = () => {
    // Placeholder for admin menu functionality
    // This could toggle a dedicated admin sidebar/drawer in the future
    toast({title: "Admin Menu", description: "Admin-specific menu/sidebar would open here."});
  }

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section: Admin Menu (conditional) & Title */}
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={handleAdminMenuToggle} aria-label="Open admin menu" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          )}
           <Button variant="ghost" size="icon" onClick={toggleSearch} aria-label="Toggle search" className="md:hidden">
            <Search className="h-6 w-6" />
          </Button>
          <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            BeautyHub
          </Link>
        </div>

        {/* Center Section: Search Bar (conditionally visible on md and up) */}
        <div className={cn(
          "hidden md:flex flex-grow max-w-md mx-4",
          {'md:hidden': !isSearchVisible && typeof window !== 'undefined' && window.innerWidth >= 768} // Hide on md+ if not toggled
        )}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands..."
                className="pl-10 w-full h-10 rounded-lg bg-background theme-blush-pink:bg-pink-50/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchVisible} // Autofocus when shown
              />
            </div>
          </form>
        </div>
         {!isAdmin && <div className="hidden md:flex flex-grow max-w-md mx-4"></div>} {/* Placeholder for centering for non-admins */}


        {/* Right Section: Icons and Auth */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex">
            <Link href="#" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full">1</Badge>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex">
            <Link href="#" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          
          {/* Cart icon is moved to BottomNavigationBar for mobile, kept here for larger screens */}
          <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex">
            <Link href="/cart" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full">2</Badge>
            </Link>
          </Button>

          {loading ? (
            <Button variant="ghost" size="icon" disabled className="px-2">
              <User className="h-6 w-6 animate-pulse" />
            </Button>
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                   <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.user_metadata?.avatar_url || `https://placehold.co/40x40.png/E0C0E0/333333?text=${getInitials(currentUser.email)}`} alt={currentUser.email || 'User'} />
                      <AvatarFallback>{getInitials(currentUser.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                      <Link href={ordersLinkHref}><Package className="mr-2 h-4 w-4" />{ordersLinkText}</Link>
                  </DropdownMenuItem>
                  {userRole === 'admin' && (
                      <>
                      <DropdownMenuItem asChild>
                         <Link href="/admin/products"><Settings className="mr-2 h-4 w-4" /> Products</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                         <Link href="/admin/workers"><Users className="mr-2 h-4 w-4" /> Workers</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                         <Link href="/admin/incoming-orders"><Package className="mr-2 h-4 w-4" /> Incoming Orders</Link>
                      </DropdownMenuItem>
                      </>
                  )}
                  {userRole === 'worker' && (
                       <DropdownMenuItem asChild>
                         <Link href="/delivery/dashboard"><Truck className="mr-2 h-4 w-4" /> Delivery Panel</Link>
                      </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" asChild size="sm" className="ml-2">
              <Link href="/login">
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
      {/* Search Bar (conditionally visible on mobile, below header) */}
      {isSearchVisible && (
        <div className="md:hidden px-4 pb-3 border-b border-border">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands..."
                className="pl-10 w-full h-10 rounded-lg bg-background theme-blush-pink:bg-pink-50/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
               <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setIsSearchVisible(false)}
                >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
