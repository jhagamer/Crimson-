
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CartItemType, Address } from '@/types';
import { mockProducts } from '@/lib/mock-data';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');

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
      return;
    }

    if (paymentMethod === 'card') {
      console.log('Proceeding to Stripe payment');
      toast({
        title: 'Redirecting to Payment (Mock)',
        description: 'You would now be redirected to Stripe.',
      });
      // In a real app, you might redirect to a Stripe checkout session
      // For now, we can simulate by redirecting to order tracking or home.
      // router.push(`/orders/ORD12345CRIMSON`); // Example redirect
    } else if (paymentMethod === 'cod') {
      console.log('Placing order with Cash on Delivery');
      toast({
        title: 'Order Placed Successfully!',
        description: 'Your order will be delivered soon. Please pay upon delivery.',
      });
      // Clear cart (mock) and redirect to home or an order confirmation page
      // setCartItems([]); // If cart was global state, dispatch an action here
      router.push('/'); // Redirect to home page for simplicity
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 50.00; // Example shipping cost in NRS
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
                <span>NRS {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-2"/>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>NRS {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>NRS {shippingCost.toFixed(2)}</span>
            </div>
            <Separator className="my-2"/>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">NRS {total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={(value: 'card' | 'cod') => setPaymentMethod(value)} className="space-y-2">
              <div className="flex items-center space-x-2 p-3 border rounded-md hover:border-primary transition-colors cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-primary">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-grow cursor-pointer">Credit/Debit Card (Mock Stripe)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-md hover:border-primary transition-colors cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-primary">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex-grow cursor-pointer">Cash on Delivery</Label>
              </div>
            </RadioGroup>
          </div>

        </CardContent>
        <CardFooter>
          <Button onClick={handlePayment} className="w-full" disabled={!shippingAddress}>
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

