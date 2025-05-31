
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const foundProduct = mockProducts.find(p => p.id === params.productId);
    setProduct(foundProduct || null);
    setSelectedImageIndex(0); // Reset to first image when product changes
  }, [params.productId]);

  const handleAddToCart = () => {
    if (!product) return;
    // In a real app, this would interact with a cart service/context
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

  const currentImageUrl = product.imageUrls[selectedImageIndex];

  return (
    <div className="container mx-auto py-12">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Products</Link>
      </Button>
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <CardHeader className="p-0 md:p-6 flex flex-col items-center">
             <div className="aspect-square relative w-full max-w-md rounded-lg overflow-hidden mb-4">
              <Image
                src={currentImageUrl}
                alt={`${product.name} - image ${selectedImageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint={`${product.category.toLowerCase()} product large`}
                priority // Prioritize loading of the main image
              />
            </div>
            {product.imageUrls.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto p-2 justify-center">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 relative rounded-md overflow-hidden border-2 transition-all
                                ${index === selectedImageIndex ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-muted-foreground/50'}`}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={`${product.category.toLowerCase()} product thumbnail`}
                    />
                  </button>
                ))}
              </div>
            )}
          </CardHeader>
          <div className="flex flex-col justify-center p-6">
            <CardTitle className="text-3xl lg:text-4xl font-bold text-primary mb-3">{product.name}</CardTitle>
            {product.brand && <p className="text-sm text-muted-foreground mb-2">Brand: {product.brand}</p>}
            <Badge variant="secondary" className="w-fit mb-4">{product.category}</Badge>
            
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
              ))}
              {product.reviewCount && <span className="ml-2 text-sm text-muted-foreground">({product.reviewCount} Reviews)</span>}
            </div>

            <CardDescription className="text-base text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </CardDescription>
            
            <Separator className="my-6" />

            <div className="flex items-baseline mb-1">
              <p className="text-4xl font-bold text-foreground">NRS {product.price.toFixed(2)}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xl line-through text-muted-foreground ml-3">NRS {product.originalPrice.toFixed(2)}</p>
              )}
            </div>
             {product.tag && (
              <Badge 
                variant={product.tag.toLowerCase().includes('save') || product.tag.toLowerCase().includes('sale') ? "destructive" : "default"} 
                className="w-fit mb-4 text-xs"
              >
                {product.tag}
              </Badge>
            )}
            
            <p className={`text-sm font-medium mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
              {product.stock > 0 ? `${product.stock} in stock - Order soon!` : 'Currently Out of Stock'}
            </p>
            
            {/* Placeholder for file input - actual upload requires Supabase Storage integration */}
            <div className="my-4 p-4 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground mb-2">Upload Product Images (Admin Feature Placeholder)</p>
                <Input type="file" multiple disabled/>
                <p className="text-xs text-muted-foreground mt-1">Actual image upload requires backend integration with Supabase Storage.</p>
            </div>


            <CardFooter className="p-0">
              <Button 
                size="lg" 
                onClick={handleAddToCart} 
                disabled={product.stock === 0} 
                className="w-full text-lg py-3 btn-primary-gradient"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center text-foreground">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.id !== product.id).slice(0,4).map(p => (
                <Card key={p.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <Link href={`/products/${p.id}`}>
                        <div className="aspect-video relative w-full">
                             <Image src={p.imageUrls[0]} alt={p.name} layout="fill" objectFit="cover" data-ai-hint={`${p.category.toLowerCase()} product related`}/>
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

      {/* Review System Placeholder */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Customer Reviews</h2>
        <Card className="p-6 shadow-lg">
          <CardContent>
            <p className="text-muted-foreground">Review system coming soon! This will allow users to share their feedback and ratings for products.</p>
            {/* Example of how a review might look */}
            <div className="mt-4 border-t pt-4">
                <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                    <span className="ml-2 font-semibold">Great Product!</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">by Jane D. on 01 Jan 2024</p>
                <p className="text-sm">This serum is amazing, my skin feels so refreshed. Highly recommend!</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
