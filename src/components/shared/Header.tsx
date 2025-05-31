
'use client';

import Link from 'next/link';
import { ShoppingCart, User, Package, LogOut, Settings, Truck, Users, Search, Menu, Bell, Heart } from 'lucide-react';
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


export default function Header() {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isAdmin = currentUser?.email === 'admin@example.com' || 
                  currentUser?.email === 'shopcrimsonhouse@gmail.com' ||
                  currentUser?.email === 'jhagamernp098@gmail.com';
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
    if (!supabase) {
      toast({ title: "Logout Failed", description: "Supabase client not initialized.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Placeholder for hamburger menu functionality
  const handleMenuToggle = () => {
    console.log("Hamburger menu toggled");
    toast({title: "Menu", description: "Mobile menu would open here."});
  }

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section: Hamburger and Title */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={handleMenuToggle} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            BeautyHub
          </Link>
        </div>

        {/* Center Section: Search Bar (visible on md and up) */}
        <div className="hidden md:flex flex-grow max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands..."
                className="pl-10 w-full h-10 rounded-lg bg-background theme-blush-pink:bg-pink-50/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right Section: Icons and Auth */}
        <nav className="flex items-center space-x-2">
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="#" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full">1</Badge>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="#" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
               {/* <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full">3</Badge> */}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
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
            <>
            {/* Hidden on small screens where it might be in a drawer menu */}
             <div className="hidden sm:flex items-center space-x-1">
                <Button variant="ghost" asChild size="sm">
                <Link href={ordersLinkHref} className="flex items-center text-foreground hover:text-primary transition-colors">
                    <Package className="mr-1 h-5 w-5" /> {ordersLinkText}
                </Link>
                </Button>
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
                        <Truck className="mr-1 h-5 w-5" /> Delivery
                    </Link>
                    </Button>
                )}
             </div>

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
                    <DropdownMenuItem asChild className="sm:hidden">
                        <Link href={ordersLinkHref}><Package className="mr-2 h-4 w-4" />{ordersLinkText}</Link>
                    </DropdownMenuItem>
                    {userRole === 'admin' && (
                        <>
                        <DropdownMenuItem asChild className="sm:hidden">
                           <Link href="/admin/products"><Settings className="mr-2 h-4 w-4" /> Products</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild className="sm:hidden">
                           <Link href="/admin/workers"><Users className="mr-2 h-4 w-4" /> Workers</Link>
                        </DropdownMenuItem>
                        </>
                    )}
                    {userRole === 'worker' && (
                         <DropdownMenuItem asChild className="sm:hidden">
                           <Link href="/delivery/dashboard"><Truck className="mr-2 h-4 w-4" /> Delivery Panel</Link>
                        </DropdownMenuItem>
                    )}
                     <DropdownMenuItem  className="sm:hidden">
                        <ThemeSwitcher /> <span className="ml-2">Switch Theme</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="sm:hidden"/>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="ghost" asChild size="sm" className="ml-2">
              <Link href="/login">
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
      {/* Search Bar (visible on sm only, below header) */}
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
            />
          </div>
        </form>
      </div>
    </header>
  );
}

// Need to import Dropdown components for the user menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

