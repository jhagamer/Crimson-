
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
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react'; // Import an icon for the button

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [tipAmount, setTipAmount] = useState<string>('');

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
    const parsedTip = parseFloat(tipAmount) || 0;

    console.log('Placing order with Cash on Delivery, Tip:', parsedTip.toFixed(2));
    toast({
      title: 'Order Placed Successfully!',
      description: `Your order (including a tip of NRS ${parsedTip.toFixed(2)}) will be delivered soon. Please pay upon delivery.`,
    });
    router.push('/');
  };

  const handleUpdateAddressWithLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Fetching Location',
      description: 'Please wait while we fetch your current location...',
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        toast({
          title: 'Location Fetched (Mock)',
          description: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}. In a real app, this would update your address.`,
        });
        console.log('Fetched location:', { latitude, longitude });
        // Mock update of address for demonstration purposes
        // You would typically use a geocoding API here to convert lat/lon to a full address
        // For now, we can simulate setting a part of the address or just log it
        setShippingAddress(prev => ({
          ...(prev || { street: '', city: '', state: '', zipCode: '', country: '' }),
          street: `Current Location (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})`,
          city: 'Nearby City (Geocoded)',
          country: 'Current Country (Geocoded)'
        }));
      },
      (error) => {
        let message = 'An error occurred while fetching your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'You denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'The request to get user location timed out.';
            break;
          default:
            message = 'An unknown error occurred.';
            break;
        }
        toast({
          title: 'Location Error',
          description: message,
          variant: 'destructive',
        });
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true, // For precise location
        timeout: 10000, // 10 seconds
        maximumAge: 0, // Don't use a cached position
      }
    );
  };


  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 50.00;
  const parsedTip = parseFloat(tipAmount) || 0;
  const total = subtotal + shippingCost + parsedTip;

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
                <div className="mt-2 space-x-2">
                  <Button variant="link" asChild className="p-0 h-auto text-primary text-xs">
                    <Link href="/address">Edit Manually</Link>
                  </Button>
                  <Button
                    variant="link"
                    onClick={handleUpdateAddressWithLocation}
                    className="p-0 h-auto text-primary text-xs"
                  >
                    <MapPin className="mr-1 h-3 w-3" /> Use Current Location
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed rounded-md text-center">
                <p className="text-muted-foreground mb-2">No shipping address provided.</p>
                 <Button
                    variant="outline"
                    onClick={handleUpdateAddressWithLocation}
                    className="mb-2"
                  >
                    <MapPin className="mr-2 h-4 w-4" /> Use Current Location
                  </Button>
                <Button variant="outline" asChild>
                  <Link href="/address">Add Shipping Address Manually</Link>
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
            <div className="space-y-2 mt-4">
              <Label htmlFor="tipAmount" className="text-sm font-medium">Add a tip (NRS)</Label>
              <Input 
                id="tipAmount" 
                type="number" 
                placeholder="0.00" 
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                className="text-sm"
              />
            </div>
             {parsedTip > 0 && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Tip</span>
                <span>NRS {parsedTip.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2"/>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">NRS {total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3">Payment Method</h3>
            <div className="p-3 border rounded-md bg-secondary/20">
              <Label className="flex-grow">Cash on Delivery</Label>
              <p className="text-xs text-muted-foreground mt-1">You will pay when your order arrives.</p>
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button onClick={handlePayment} className="w-full" disabled={!shippingAddress && cartItems.length === 0}>
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

