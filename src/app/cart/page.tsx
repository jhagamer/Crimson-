
'use client';

import { useState, useEffect } from 'react';
import type { CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { mockProducts } from '@/lib/mock-data'; 
import { Input } from '@/components/ui/input'; 

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simulate fetching cart items or initializing with some mock data
    // For this example, let's add the first two mock products to the cart
    const initialCartItems: CartItemType[] = mockProducts.slice(0, 2).map(p => ({ ...p, quantity: 1 }));
    setCartItems(initialCartItems);
    // TODO: Replace with fetching cart from Supabase for logged-in user
    // const userId = supabase.auth.user()?.id;
    // if (userId) { /* fetch cart from supabase */ } else { /* use localStorage or show message */ }
  }, []);
  

  const handleQuantityChange = (id: string, newQuantity: number) => {
    const quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // Example 10% tax
  const total = subtotal + tax;

  if (!isClient) {
    return <div className="text-center py-10">Loading cart...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Shopping Cart</h1>
      <p className="text-sm text-muted-foreground mb-4">Note: Cart data is currently local and will be cleared on refresh. User-specific persistent carts require backend integration.</p>
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden shrink-0 bg-secondary/20"> {/* Added background for letterboxing */}
                   <Image src={item.imageUrls[0]} alt={item.name} layout="fill" objectFit="contain" data-ai-hint={`${item.category.toLowerCase()} product small`} /> {/* Changed to contain */}
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">NRS {item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                    className="w-16 h-9 text-center"
                    min="1"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-primary shrink-0 w-24 text-center sm:text-right">
                  NRS {(item.price * item.quantity).toFixed(2)}
                </p>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive hover:text-destructive/80 shrink-0">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>
          <Card className="md:col-span-1 h-fit sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>NRS {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>NRS {tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">NRS {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
