
import ProductList from '@/components/products/ProductList';
import { mockProducts } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import Image from 'next/image'; // Added missing import

export default function HomePage() {
  // const { toast } = useToast(); // Not used currently

  // Example: How to handle add to cart from a shared component if needed
  // const handleAddToCart = (product: import('@/types').Product) => {
  //   console.log("Added to cart from HomePage:", product.name);
  //   toast({
  //     title: "Added to Cart",
  //     description: `${product.name} has been added to your cart.`,
  //   });
  //   // Add actual cart logic here (e.g., update context/state)
  // };

  return (
    <section className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">Welcome to Crimson Cosmetics</h1>
        <p className="text-xl text-muted-foreground">Discover our exclusive collection of premium beauty essentials.</p>
      </div>
      
      {/* Placeholder for a promotional banner like in the image */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-rose-100 p-8 rounded-xl shadow-lg theme-blush-pink:from-[hsl(var(--primary_lighter,335_90%_90%))] theme-blush-pink:to-[hsl(var(--accent_lighter,320_85%_92%))]">
        <div className="aspect-[16/6] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
           {/* Using an actual image would be better here. For now, a placeholder. */}
          <Image src="https://placehold.co/1200x450.png/fde0ef/a78bfa?text=Spring+Collection+Out+Now" alt="Promotional Banner" width={1200} height={450} className="object-cover w-full h-full" data-ai-hint="cosmetics promotion" />
        </div>
      </div>

      <Card className="shadow-lg border-border/70 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4 sm:px-6">
          <CardTitle className="text-2xl font-semibold text-foreground">Featured Cosmetics</CardTitle>
          <Link href="/search?q=featured" aria-label="View all featured cosmetics" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="pt-2 px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {mockProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} /* onAddToCart={handleAddToCart} */ />
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-3xl font-semibold mb-6 text-foreground">All Products</h2>
        <ProductList products={mockProducts} /* itemAddToCartHandler={handleAddToCart} */ />
      </div>
    </section>
  );
}
