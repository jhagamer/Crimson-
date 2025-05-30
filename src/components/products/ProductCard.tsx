
'use client';

import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <div className="aspect-square relative w-full overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={`${product.category.toLowerCase()} product`}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-3 text-center flex flex-col flex-grow justify-between">
          <div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
          <p className="text-foreground font-bold text-md mt-2">
            NRS {product.price.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
