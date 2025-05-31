
'use client';

import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void; // Optional: if add to cart is handled outside
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleDirectAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if button is inside Link
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // Default cart logic if needed, or emit an event
      console.log(`Added ${product.name} to cart from ProductCard`);
      // You might want to use a global state/context for cart here
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full rounded-xl group border-border/70">
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="aspect-square relative w-full overflow-hidden rounded-t-xl">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={`${product.category.toLowerCase()} product`}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          {product.tag && (
            <Badge 
              variant={product.tag.toLowerCase().includes('save') ? "destructive" : "secondary"} 
              className="absolute top-2 left-2 text-xs px-2 py-1 rounded-md"
            >
              {product.tag}
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-8 w-8 bg-card/70 hover:bg-card rounded-full text-muted-foreground hover:text-primary"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log("Wishlist clicked for", product.name);}} // Placeholder
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>
      <CardContent className="p-3 sm:p-4 text-left flex flex-col flex-grow">
        {product.brand && (
          <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
        )}
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {product.rating && product.reviewCount && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        )}
        
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-primary font-bold text-base sm:text-lg">
            NRS {product.price.toFixed(0)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-muted-foreground line-through">
              NRS {product.originalPrice.toFixed(0)}
            </p>
          )}
        </div>

        <div className="mt-auto pt-3"> 
          <Button 
            onClick={handleDirectAddToCart} 
            className="w-full btn-primary-gradient text-sm h-9"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
