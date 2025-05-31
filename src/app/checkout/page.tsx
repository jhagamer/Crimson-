
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CartItemType, Address, Order } from '@/types';
import { mockProducts } from '@/lib/mock-data';
import { Label } from "@/components/ui/label";
import { MapPin, Phone } from 'lucide-react'; 

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(0);

  const tipOptions = [0, 10, 20, 30]; 

  useEffect(() => {
    setIsClient(true);
    // Simulate fetching cart items
    const initialCartItems: CartItemType[] = mockProducts.slice(0, 1).map(p => ({ ...p, quantity: 2 }));
    setCartItems(initialCartItems);
    
    // Try to load address from localStorage
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      try {
        setShippingAddress(JSON.parse(savedAddress));
      } catch (e) {
        console.error("Failed to parse shipping address from localStorage", e);
        setShippingAddress(null); // Or set a default mock
      }
    } else {
      // Default mock if nothing in localStorage
      setShippingAddress({
        fullName: 'John Doe (Default)',
        phone: '+15551234567',
        street: '123 Crimson Way',
        city: 'Redville',
        state: 'CR',
        zipCode: '12345',
        country: 'Crimsonland'
      });
    }
  }, []);

  const handleEditAddress = () => {
    localStorage.setItem('addressRedirectPath', '/checkout'); // Remember to come back to checkout
    router.push('/address');
  };

  const handlePayment = () => {
    if (!shippingAddress || !shippingAddress.street) { // Check for a valid address object
      toast({
        title: 'Address Required',
        description: 'Please add or confirm a shipping address before proceeding.',
        variant: 'destructive',
      });
      localStorage.setItem('addressRedirectPath', '/checkout');
      router.push('/address'); 
      return;
    }
    if (cartItems.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty. Please add items before checking out.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }
    
    const mockOrderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const newOrder: Order = {
      id: mockOrderId,
      items: cartItems,
      totalAmount: total, 
      status: 'Processing', 
      shippingAddress: shippingAddress,
      createdAt: new Date().toISOString(),
      trackingNumber: `CMTRK${Date.now()}`,
      isPhoneConfirmed: false, // New orders are not phone confirmed by default
    };

    localStorage.setItem(`orderDetails_${mockOrderId}`, JSON.stringify(newOrder));
    localStorage.setItem('lastPlacedOrderId', mockOrderId);
    
    setCartItems([]); 

    toast({
      title: 'Order Placed Successfully!',
      description: `Your order #${mockOrderId} (including a tip of NRS ${tipAmount.toFixed(2)}) will be delivered soon. You can track its status.`,
      duration: 5000,
    });
    router.push(`/orders/${mockOrderId}`);
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
        // Preserve existing phone and name if possible, or set defaults
        const currentFullName = shippingAddress?.fullName || 'Located User';
        const currentPhone = shippingAddress?.phone || '';

        const newMockAddress: Address = {
          fullName: currentFullName,
          phone: currentPhone, // Keep existing phone or prompt user to add it.
          street: `Current Location (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})`,
          city: 'Nearby City (Geocoded)',
          state: 'Auto',
          zipCode: '00000',
          country: 'Current Country (Geocoded)'
        };
        setShippingAddress(newMockAddress);
        localStorage.setItem('shippingAddress', JSON.stringify(newMockAddress)); 
        toast({
          title: 'Location Updated (Mock)',
          description: `Address updated to current location. Please verify full name and phone.`,
        });
      },
      (error) => {
        let message = 'An error occurred while fetching your location.';
        // ... (error handling messages as before)
        toast({
          title: 'Location Error',
          description: message,
          variant: 'destructive',
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };


  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 50.00;
  const total = subtotal + shippingCost + tipAmount;

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
            {shippingAddress && shippingAddress.street ? (
              <div className="text-sm text-muted-foreground p-4 border rounded-md bg-secondary/30">
                <p><strong>{shippingAddress.fullName}</strong></p>
                {shippingAddress.phone && <p className="flex items-center"><Phone className="mr-2 h-3 w-3"/>{shippingAddress.phone}</p>}
                <p>{shippingAddress.street}, {shippingAddress.apartment || ''}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                <p>{shippingAddress.country}</p>
                <div className="mt-2 space-x-2">
                  <Button variant="link" onClick={handleEditAddress} className="p-0 h-auto text-primary text-xs">
                    Edit Manually
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
                    className="mb-2 mr-2"
                  >
                    <MapPin className="mr-2 h-4 w-4" /> Use Current Location
                  </Button>
                <Button variant="outline" onClick={handleEditAddress}>
                  Add Shipping Address
                </Button>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
            {cartItems.length > 0 ? cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 text-sm">
                <span>{item.name} (x{item.quantity})</span>
                <span>NRS {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
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
              <Label className="text-sm font-medium">Add a tip for your delivery person</Label>
              <div className="flex space-x-2">
                {tipOptions.map((amount) => (
                  <Button
                    key={amount}
                    variant={tipAmount === amount ? "default" : "outline"}
                    onClick={() => setTipAmount(amount)}
                    className="flex-1 text-sm"
                  >
                    {amount === 0 ? "No Tip" : `NRS ${amount}`}
                  </Button>
                ))}
              </div>
            </div>

             {tipAmount > 0 && (
              <div className="flex justify-between text-sm mt-2 text-primary font-medium">
                <span >Tip</span>
                <span>NRS {tipAmount.toFixed(2)}</span>
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
          <Button 
            onClick={handlePayment} 
            className="w-full" 
            disabled={!shippingAddress || !shippingAddress.street || cartItems.length === 0}
          >
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
