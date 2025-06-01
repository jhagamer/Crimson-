
'use client';

import { useEffect, useState } from 'react';
import ProductList from '@/components/products/ProductList';
import { mockCategories } from '@/lib/mock-data'; 
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CategoryCard from '@/components/categories/CategoryCard';
import { supabase } from '@/lib/supabaseClient';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface BannerItem {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  dataAiHints?: string[];
  shopNowLink?: string;
  learnMoreLink?: string;
  redirectButtonText?: string;
  redirectButtonUrl?: string;
  gradientClass?: string;
}

// Mock data for banners - in a real app, this would come from Supabase
const initialBannerItems: BannerItem[] = [
  {
    id: 'banner1',
    title: 'Summer Glow Collection',
    description: 'Discover our latest skincare essentials for that perfect summer radiance.',
    imageUrls: [
      'https://placehold.co/600x400.png/FFDAB9/8A2BE2?text=Glow+Up+1!',
      'https://placehold.co/600x400.png/E0FFFF/008080?text=Shine+Bright+2!',
      'https://placehold.co/600x400.png/FFF0F5/FF69B4?text=Summer+Vibes+3!'
    ],
    dataAiHints: ['cosmetics lifestyle summer', 'skincare beach', 'beauty products sun'],
    shopNowLink: '/search?category=skincare',
    learnMoreLink: '/about-summer-collection',
    redirectButtonText: 'Explore More',
    redirectButtonUrl: '/all-products',
    gradientClass: 'promo-banner-gradient',
  },
  // Add more banner items here if you want a carousel of banners
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  const [bannerItems, setBannerItems] = useState<BannerItem[]>(initialBannerItems);
  // For now, we'll just display the first banner item. A carousel for bannerItems would be a further enhancement.
  const currentBanner = bannerItems.length > 0 ? bannerItems[0] : null;
  const [currentBannerImageIndex, setCurrentBannerImageIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supabase) {
        setProductError("Supabase client is not available. Cannot fetch products.");
        setIsLoadingProducts(false);
        return;
      }
      setIsLoadingProducts(true);
      setProductError(null);
      
      // In a real app, you'd fetch "most selling" or featured products.
      // For now, fetching a general list.
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .limit(8); 

      if (fetchError) {
        console.error('Error fetching products:', fetchError);
        setProductError(`Failed to load products: ${fetchError.message}`);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setIsLoadingProducts(false);
    };

    // Fetch products from Supabase
    fetchProducts();

    // In a real app, bannerItems would also be fetched from Supabase
    // e.g., fetchBannerItems().then(data => setBannerItems(data));
  }, []);

  const handleNextImage = () => {
    if (currentBanner) {
      setCurrentBannerImageIndex((prevIndex) =>
        prevIndex === currentBanner.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (currentBanner) {
      setCurrentBannerImageIndex((prevIndex) =>
        prevIndex === 0 ? currentBanner.imageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <section className="space-y-10 pb-16">
      {/* Promotional Banner */}
      {currentBanner && (
        <Card className={`rounded-xl shadow-lg overflow-hidden ${currentBanner.gradientClass || 'bg-muted'}`}>
          <div className="relative"> {/* Container for image and navigation buttons */}
            <CardContent className="p-6 sm:p-10 flex flex-col md:flex-row items-center min-h-[300px] md:min-h-[400px] relative z-10">
              <div className="flex-1 text-center md:text-left mb-6 md:mb-0 text-foreground">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                  {currentBanner.title}
                </h1>
                <p className="text-lg text-foreground/80 mb-6 max-w-md">
                  {currentBanner.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  {currentBanner.shopNowLink && (
                    <Button size="lg" className="rounded-full px-8 py-3 text-base btn-primary-gradient" asChild>
                      <Link href={currentBanner.shopNowLink}>Shop Now</Link>
                    </Button>
                  )}
                  {currentBanner.learnMoreLink && (
                     <Button size="lg" variant="outline" className="rounded-full px-8 py-3 text-base border-foreground/50 text-foreground/90 hover:bg-foreground/5 hover:text-foreground" asChild>
                      <Link href={currentBanner.learnMoreLink}>Learn More</Link>
                    </Button>
                  )}
                  {currentBanner.redirectButtonText && currentBanner.redirectButtonUrl && (
                    <Button size="lg" variant="secondary" className="rounded-full px-8 py-3 text-base" asChild>
                      <Link href={currentBanner.redirectButtonUrl}>{currentBanner.redirectButtonText}</Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="hidden md:block flex-shrink-0 w-full md:w-1/3 max-w-xs md:max-w-sm opacity-0 pointer-events-none">
                {/* This div is effectively a spacer now, image is background */}
              </div>
            </CardContent>
            
            {/* Background Image and Slider Controls */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={currentBanner.imageUrls[currentBannerImageIndex]}
                alt={currentBanner.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg opacity-30 md:opacity-100" // More opaque on mobile
                data-ai-hint={currentBanner.dataAiHints?.[currentBannerImageIndex] || 'promotional background'}
                priority
              />
              {/* Overlay to darken the image a bit for text readability, especially on mobile */}
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 rounded-lg"></div>

              {currentBanner.imageUrls.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-card/50 hover:bg-card/80 text-foreground"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-card/50 hover:bg-card/80 text-foreground"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Shop by Category Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {mockCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Trending Products Section - Fetched from Supabase */}
      <Card className="shadow-lg border-border/70 rounded-xl bg-transparent sm:bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-2 sm:px-6">
          <CardTitle className="text-2xl font-semibold text-foreground">Trending Products</CardTitle>
          <Button variant="link" asChild className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            <Link href="/search?q=all">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-2 px-2 sm:px-4">
          {isLoadingProducts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-40 w-full sm:h-48 md:h-56" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}
          {productError && (
            <div className="text-center py-10 text-destructive flex flex-col items-center">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Error loading products</p>
              <p className="text-sm">{productError}</p>
            </div>
          )}
          {!isLoadingProducts && !productError && products.length > 0 && (
            <ProductList products={products} />
          )}
          {!isLoadingProducts && !productError && products.length === 0 && (
             <p className="text-center text-muted-foreground py-8">No products available at the moment. Check back soon!</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
