import ProductList from '@/components/products/ProductList';
import { mockProducts } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">Welcome to Crimson Commerce</h1>
        <p className="text-xl text-muted-foreground">Discover our exclusive collection of finely curated items.</p>
      </div>
      <Separator />
      <div>
        <h2 className="text-3xl font-semibold mb-6 text-foreground">Featured Products</h2>
        <ProductList products={mockProducts} />
      </div>
    </section>
  );
}
