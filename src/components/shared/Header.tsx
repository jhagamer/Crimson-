
'use client';

import Link from 'next/link';
import { ShoppingCart, User, Package, LogIn, LogOut, Settings, Truck, HomeIcon, Users } from 'lucide-react'; // Added Users
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth'; // Import the custom auth hook
import { signOutUser } from '@/lib/firebase'; // Import the signOut function
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // For user avatar
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Header() {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  // Mock role for demonstration purposes. In a real app, this would come from your backend/Firestore.
  // To test different roles, you can change this value:
  // const userRole = currentUser ? 'customer' : null; 
  // const userRole = currentUser ? 'admin' : null;
  const userRole = currentUser ? (currentUser.email === 'admin@example.com' ? 'admin' : (currentUser.email === 'worker@example.com' ? 'worker' : 'customer')) : null;


  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login'); // Redirect to login page after logout
    } catch (error: any) {
      toast({
        title: 'Logout Failed',
        description: error.message || 'An error occurred during logout.',
        variant: 'destructive',
      });
    }
  };

  // Get first letter of email for Avatar Fallback
  const getInitials = (email?: string | null) => {
    if (!email) return '';
    return email.charAt(0).toUpperCase();
  }


  return (
    <header className="bg-card border-b border-border shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors flex items-center">
          <HomeIcon className="mr-2 h-7 w-7" /> Crimson Commerce
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex text-sm">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/cart" className="flex items-center text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="mr-0 sm:mr-1 h-5 w-5" /> <span className="hidden sm:inline">Cart</span>
            </Link>
          </Button>
          
          {currentUser && (
            <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/orders/ORD12345CRIMSON" className="flex items-center text-foreground hover:text-primary transition-colors"> {/* Mock order ID */}
                <Package className="mr-1 h-5 w-5" /> Orders
              </Link>
            </Button>
          )}

          {currentUser && userRole === 'admin' && (
            <>
              <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/admin/products" className="flex items-center text-foreground hover:text-primary transition-colors">
                  <Settings className="mr-1 h-5 w-5" /> Products
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/admin/workers" className="flex items-center text-foreground hover:text-primary transition-colors">
                  <Users className="mr-1 h-5 w-5" /> Workers
                </Link>
              </Button>
            </>
          )}

          {currentUser && userRole === 'worker' && (
            <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/delivery/dashboard" className="flex items-center text-foreground hover:text-primary transition-colors">
                <Truck className="mr-1 h-5 w-5" /> Delivery Panel
              </Link>
            </Button>
          )}

          {loading ? (
            <Button variant="outline" size="icon" disabled>
              <User className="h-5 w-5 animate-pulse" />
            </Button>
          ) : currentUser ? (
            <>
              <Button variant="ghost" asChild size="sm" className="px-2 sm:px-3">
                <Link href="/profile" className="flex items-center text-foreground hover:text-primary transition-colors">
                   <Avatar className="h-6 w-6 sm:h-7 sm:w-7 mr-0 sm:mr-2">
                    {currentUser.photoURL ? (
                      <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || currentUser.email || 'User'} />
                    ) : null}
                    <AvatarFallback>{getInitials(currentUser.email)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">{currentUser.displayName || currentUser.email}</span>
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} size="icon" title="Logout"  className="hidden sm:inline-flex">
                <LogOut className="h-5 w-5" />
              </Button>
               <Button variant="ghost" onClick={handleLogout} size="icon" title="Logout" className="sm:hidden inline-flex">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="default" asChild size="sm">
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

