'use client';

import Image from 'next/image';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    // In a real app, this would update global cart state
    console.log(`Added ${product.name} to cart`);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-video relative w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={`${product.category.toLowerCase()} item`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 text-foreground">{product.name}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mb-4 h-20 overflow-hidden text-ellipsis">
          {product.description}
        </CardDescription>
        <p className="text-lg font-bold text-primary mb-2">${product.price.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-2 justify-between">
        <Button variant="outline" className="w-full sm:w-auto" asChild>
           <Link href={`/products/${product.id}`}><Info className="mr-2 h-4 w-4" /> Details</Link>
        </Button>
        <Button 
          onClick={handleAddToCart} 
          disabled={product.stock === 0} 
          className="w-full sm:w-auto"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
