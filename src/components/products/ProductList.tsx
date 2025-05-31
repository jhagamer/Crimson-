import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  itemAddToCartHandler?: (product: Product) => void; // Optional handler
}

export default function ProductList({ products, itemAddToCartHandler }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={itemAddToCartHandler} />
      ))}
    </div>
  );
}
