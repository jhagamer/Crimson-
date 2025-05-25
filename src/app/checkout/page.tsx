'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CartItemType, Address } from '@/types'; // Assuming Address type is defined
import { mockProducts } from '@/lib/mock-data'; // Using mock products for cart items

export default function CheckoutPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simulate fetching cart items and address
    const initialCartItems: CartItemType[] = mockProducts.slice(0, 1).map(p => ({ ...p, quantity: 2 }));
    setCartItems(initialCartItems);
    setShippingAddress({
      street: '123 Crimson Way',
      city: 'Redville',
      state: 'CR',
      zipCode: '12345',
      country: 'Crimsonland'
    });
  }, []);


  const handlePayment = () => {
    if (!shippingAddress) {
      toast({
        title: 'Address Required',
        description: 'Please add a shipping address before proceeding to payment.',
        variant: 'destructive',
      });
      // router.push('/address'); // Optionally redirect to address page
      return;
    }
    // Mock Stripe integration
    console.log('Proceeding to Stripe payment');
    toast({
      title: 'Redirecting to Payment (Mock)',
      description: 'You would now be redirected to Stripe.',
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.00; // Example shipping cost
  const total = subtotal + shippingCost;

  if (!isClient) {
    return <div className="text-center py-10">Loading checkout...</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Checkout</CardTitle>
          <CardDescription>Review your order and complete your purchase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
            {shippingAddress ? (
              <div className="text-sm text-muted-foreground p-4 border rounded-md bg-secondary/30">
                <p>{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                <p>{shippingAddress.country}</p>
                <Button variant="link" asChild className="p-0 h-auto mt-1 text-primary">
                  <Link href="/address">Change address</Link>
                </Button>
              </div>
            ) : (
              <div className="p-4 border border-dashed rounded-md text-center">
                <p className="text-muted-foreground mb-2">No shipping address provided.</p>
                <Button variant="outline" asChild>
                  <Link href="/address">Add Shipping Address</Link>
                </Button>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 text-sm">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-2"/>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <Separator className="my-2"/>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePayment} className="w-full" disabled={!shippingAddress}>
            Proceed to Payment (Mock Stripe)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
