
'use client';

import Link from 'next/link';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSearchVisibility } from '@/contexts/SearchContext'; // Import context hook
import { useAuth } from '@/hooks/useAuth';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const content = (
    <>
      <Icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/90")} />
      <span className={cn("text-xs", isActive ? "text-primary font-medium" : "text-muted-foreground group-hover:text-primary/90")}>
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-full p-2 group flex-1"
        onClick={onClick}
        aria-label={label}
      >
        {content}
      </Button>
    );
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <a className="flex flex-col items-center justify-center h-full p-2 group flex-1">
        {content}
      </a>
    </Link>
  );
};

export default function BottomNavigationBar() {
  const { toggleSearch } = useSearchVisibility();
  const { currentUser } = useAuth();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '#search', icon: Search, label: 'Search', onClick: toggleSearch },
    { href: '/cart', icon: ShoppingCart, label: 'Cart' },
    { href: currentUser ? '/orders/history' : '/login', icon: User, label: currentUser ? 'Profile' : 'Login' }, // Dynamic label and link
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-top-sm md:hidden z-40">
      <div className="container mx-auto h-full">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </div>
    </nav>
  );
}
