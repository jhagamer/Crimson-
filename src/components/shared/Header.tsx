
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
// ThemeSwitcher removed from here
import { useEffect, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { useSearchVisibility } from '@/contexts/SearchContext'; 
import { cn } from '@/lib/utils';


export default function Header() {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { isSearchVisible, setIsSearchVisible } = useSearchVisibility(); 

  const adminEmails = ['jhagamernp098@gmail.com', 'admin@example.com', 'shopcrimsonhouse@gmail.com'];
  const isAdmin = currentUser?.email && adminEmails.includes(currentUser.email);
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // setIsSearchVisible(false); // Optionally hide search after submit
    }
  };

  const handleAdminMenuToggle = () => {
    toast({title: "Admin Menu", description: "Admin-specific menu/sidebar would open here."});
  }

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      {/* Main Header Row */}
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Left Slot (for Admin Menu Icon or just spacing) */}
        <div className="flex-1 flex justify-start">
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={handleAdminMenuToggle} aria-label="Open admin menu">
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Center Slot (Title) */}
        <div className="flex-shrink-0 text-center">
          <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            BeautyHub
          </Link>
        </div>

        {/* Right Slot (for Desktop Icons or just spacing) */}
        <div className="flex-1 flex justify-end items-center space-x-1 sm:space-x-2">
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
          <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex">
            <Link href="/cart" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full">2</Badge>
            </Link>
          </Button>
          {/* Auth related buttons/dropdown removed from here */}
        </div>
      </div>

      {/* Search Bar Section (conditionally rendered below main header row) */}
      {isSearchVisible && (
        <div className="container mx-auto px-4 pb-3 border-t md:border-t-0 pt-2 md:pt-0">
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
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 md:hidden" // Close button for mobile search
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

// DropdownMenu related imports are removed as the user avatar dropdown is gone
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
