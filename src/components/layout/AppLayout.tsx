
import type React from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import BottomNavigationBar from '@/components/shared/BottomNavigationBar'; // Import BottomNavigationBar

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pb-20 md:pb-8"> {/* Add padding-bottom for mobile nav */}
        {children}
      </main>
      <BottomNavigationBar /> {/* Add BottomNavigationBar */}
      <Footer />
    </div>
  );
}
