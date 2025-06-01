
'use client';

import { useEffect, useState } from 'react';
import ProductList from '@/components/products/ProductList';
import { mockCategories } from '@/lib/mock-data'; // Categories still from mock for now
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CategoryCard from '@/components/categories/CategoryCard';
import { supabase } from '@/lib/supabaseClient';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supabase) {
        setError("Supabase client is not available. Cannot fetch products.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      // TODO: Implement logic to fetch "most selling items" from Supabase.
      // For now, fetching a general list of products.
      // You might want to add .order() and .limit() here.
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .limit(8); // Example: limit to 8 products for trending

      if (fetchError) {
        console.error('Error fetching products:', fetchError);
        setError(`Failed to load products: ${fetchError.message}`);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <section className="space-y-10 pb-16"> {/* Added padding-bottom for bottom nav */}
      {/* Promotional Banner */}
      <Card className="rounded-xl shadow-lg overflow-hidden promo-banner-gradient">
        <CardContent className="p-6 sm:p-10 flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Summer Glow Collection
            </h1>
            <p className="text-lg text-foreground/80 mb-6 max-w-md">
              Discover our latest skincare essentials for that perfect summer radiance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button size="lg" className="rounded-full px-8 py-3 text-base btn-primary-gradient">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-3 text-base border-foreground/50 text-foreground/90 hover:bg-foreground/5">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-1/3 max-w-xs md:max-w-sm">
            <Image
              src="https://placehold.co/400x400.png/FFDAB9/8A2BE2?text=Glow+Up!"
              alt="Summer Glow Collection"
              width={400}
              height={400}
              className="rounded-lg object-cover mx-auto"
              data-ai-hint="cosmetics lifestyle summer"
              priority
            />
          </div>
        </CardContent>
      </Card>

      {/* Shop by Category Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {mockCategories.map((category) => ( // Categories still from mock
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Trending Products Section - Now fetched from Supabase */}
      <Card className="shadow-lg border-border/70 rounded-xl bg-transparent sm:bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-2 sm:px-6">
          <CardTitle className="text-2xl font-semibold text-foreground">Trending Products</CardTitle>
          {/* TODO: This link should eventually point to a page showing all products or a "trending" filter */}
          <Button variant="link" asChild className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            <Link href="/search?q=all">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-2 px-2 sm:px-4">
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="text-center py-10 text-destructive flex flex-col items-center">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Error loading products</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !error && products.length > 0 && (
            <ProductList products={products} />
          )}
          {!isLoading && !error && products.length === 0 && (
             <p className="text-center text-muted-foreground py-8">No products available at the moment. Check back soon!</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
