
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const foundProduct = mockProducts.find(p => p.id === params.productId);
    setProduct(foundProduct || null);
  }, [params.productId]);

  const handleAddToCart = () => {
    if (!product) return;
    console.log(`Added ${product.name} to cart`);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (!isClient) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold text-destructive mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you are looking for does not exist or may have been removed.</p>
        <Button asChild>
          <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Products</Link>
      </Button>
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <CardHeader className="p-0 md:p-6">
             <div className="aspect-square relative w-full rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={`${product.category.toLowerCase()} item large`}
              />
            </div>
          </CardHeader>
          <div className="flex flex-col justify-center p-6">
            <CardTitle className="text-3xl lg:text-4xl font-bold text-primary mb-3">{product.name}</CardTitle>
            <Badge variant="secondary" className="w-fit mb-4">{product.category}</Badge>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">(125 Reviews)</span> {/* Mock reviews */}
            </div>
            <CardDescription className="text-base text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </CardDescription>
            
            <Separator className="my-6" />

            <div className="flex items-baseline mb-6">
              <p className="text-4xl font-bold text-foreground">NRS {product.price.toFixed(2)}</p>
              {/* Old price for discount illusion - <p className="text-xl line-through text-muted-foreground ml-2">NRS { (product.price * 1.2).toFixed(2) }</p> */}
            </div>
            
            <p className={`text-sm font-medium mb-6 ${product.stock > 0 ? 'text-green-500' : 'text-destructive'}`}>
              {product.stock > 0 ? `${product.stock} in stock - Order soon!` : 'Currently Out of Stock'}
            </p>

            <CardFooter className="p-0">
              <Button 
                size="lg" 
                onClick={handleAddToCart} 
                disabled={product.stock === 0} 
                className="w-full text-lg py-3"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      {/* Related Products Section (Placeholder) */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center text-foreground">You Might Also Like</h2>
        {/* Placeholder for related products component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.id !== product.id).slice(0,4).map(p => (
                <Card key={p.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <Link href={`/products/${p.id}`}>
                        <div className="aspect-video relative w-full">
                             <Image src={p.imageUrl} alt={p.name} layout="fill" objectFit="cover" data-ai-hint={`${p.category.toLowerCase()} item related`}/>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-md truncate">{p.name}</h3>
                            <p className="text-primary font-bold">NRS {p.price.toFixed(2)}</p>
                        </CardContent>
                    </Link>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

