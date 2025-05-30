
import ProductList from '@/components/products/ProductList';
import { mockProducts } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

export default function HomePage() {
  return (
    <section className="space-y-12"> {/* Increased spacing */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">Welcome to Crimson Cosmetics</h1>
        <p className="text-xl text-muted-foreground">Discover our exclusive collection of premium beauty essentials.</p>
      </div>
      
      <Separator />

      <Card className="shadow-lg border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
          <CardTitle className="text-2xl font-semibold text-primary">Featured Cosmetics</CardTitle>
          <Link href="/search?q=featured" aria-label="View all featured cosmetics" className="text-primary hover:text-primary/80">
            <ArrowRight className="h-6 w-6" />
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mockProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-3xl font-semibold mb-6 text-foreground">All Products</h2>
        <ProductList products={mockProducts} />
      </div>
    </section>
  );
}
