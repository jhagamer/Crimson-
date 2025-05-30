
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductList from '@/components/products/ProductList';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const results = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]); // Or all products, or redirect, depending on desired behavior
    }
    setIsLoading(false);
  }, [query]);

  if (isLoading) {
    return <div className="text-center py-10">Loading search results...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        {query ? (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">
              Search Results for: &quot;{query}&quot;
            </h1>
            <p className="text-lg text-muted-foreground">
              {filteredProducts.length} product(s) found.
            </p>
          </>
        ) : (
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Search Products
          </h1>
        )}
      </div>
      <Separator />
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <div className="text-center py-16">
          <SearchX className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-2">
            No products found for &quot;{query}&quot;.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Try a different search term or browse our categories.
          </p>
          <Button asChild>
            <Link href="/">Back to Shop</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
