
import ProductList from '@/components/products/ProductList';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import Image from 'next/image';
import CategoryCard from '@/components/categories/CategoryCard'; // New import

export default function HomePage() {

  return (
    <section className="space-y-10">
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
              src="https://placehold.co/400x400.png/FFDAB9/8A2BE2?text=Glow+Up!" // PeachPuff bg, BlueViolet text
              alt="Summer Glow Collection"
              width={400}
              height={400}
              className="rounded-lg object-cover mx-auto"
              data-ai-hint="cosmetics lifestyle summer"
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
          {mockCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Trending Products Section */}
      <Card className="shadow-lg border-border/70 rounded-xl bg-transparent sm:bg-card"> {/* Transparent on mobile, card on sm+ */}
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-2 sm:px-6">
          <CardTitle className="text-2xl font-semibold text-foreground">Trending Products</CardTitle>
          <Button variant="link" asChild className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            <Link href="/search?q=trending">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-2 px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {mockProducts.slice(0, 8).map((product) => ( // Show more trending products
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Removed "All Products" ProductList to simplify homepage and focus on categories/trending */}
    </section>
  );
}
