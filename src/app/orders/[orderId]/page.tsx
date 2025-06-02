
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Order, CartItemType } from '@/types';
import { PackageCheck, ShoppingBag, Truck, Home, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Fallback mock order data if not found in localStorage
const fallbackMockOrder: Order = {
  id: 'FALLBACK_ORD123',
  items: [
    { id: '1', name: 'Radiant Glow Serum (Fallback)', description: 'Fallback item description.', price: 45.00, imageUrls: ['https://placehold.co/100x100.png'], stock: 0, category: 'Skincare', quantity: 1 },
  ],
  totalAmount: 45.00 + 50.00 + (45.00 * 0.1),
  status: 'Processing',
  shippingAddress: {
    street: '123 Fallback St',
    city: 'Mockville',
    state: 'FB',
    zipCode: '00000',
    country: 'Mockland',
  },
  createdAt: new Date().toISOString(),
  trackingNumber: 'FALLBACKTRACK123',
};

const statusSteps = [
  { name: 'Pending', icon: ShoppingBag, progress: 0 },
  { name: 'Processing', icon: PackageCheck, progress: 33 },
  { name: 'Shipped', icon: Truck, progress: 66 },
  { name: 'Delivered', icon: Home, progress: 100 },
];

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (params.orderId) {
      const storedOrderData = localStorage.getItem(`orderDetails_${params.orderId}`);
      if (storedOrderData) {
        try {
          setOrder(JSON.parse(storedOrderData));
        } catch (e) {
          console.error("Failed to parse order data from localStorage", e);
          setError(`Invalid order data for ID: ${params.orderId}.`);
        }
      } else {
        const staticHistory = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('staticMockOrderHistory') || '[]') : [];
        const historyOrder = staticHistory.find((histOrder: Order) => histOrder.id === params.orderId);
        if (historyOrder) {
          setOrder(historyOrder);
        } else {
          setError(`Order with ID: ${params.orderId} not found. This app uses mock data; persistent user-specific orders require backend integration.`);
        }
      }
    } else {
      setError("No order ID provided.");
    }
  }, [params.orderId]);
  
  useEffect(() => { 
    if (typeof window !== "undefined" && !localStorage.getItem('staticMockOrderHistory')) {
        const { mockOrderHistory } = require('@/lib/mock-data');
        if(mockOrderHistory) {
             localStorage.setItem('staticMockOrderHistory', JSON.stringify(mockOrderHistory));
        }
    }
  }, [])


  if (!isClient) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive flex items-center justify-center">
              <AlertCircle className="mr-2 h-7 w-7" /> Order Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/orders/history">View Order History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!order) {
     return <div className="text-center py-10">Loading order details...</div>;
  }


  const currentStatusIndex = statusSteps.findIndex(step => step.name === order.status);
  const progressValue = statusSteps[currentStatusIndex]?.progress ?? 0;
  const shippingCost = 50.00; 
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);


  return (
    <div className="container mx-auto py-12">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Order Tracking</CardTitle>
          <CardDescription>Order ID: {order.id}</CardDescription>
          {order.trackingNumber && <p className="text-sm text-muted-foreground">Tracking #: {order.trackingNumber}</p>}
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-1">Status: <span className="text-primary">{order.status}</span></h3>
            <Progress value={progressValue} className="w-full h-3 mb-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {statusSteps.map((step, index) => (
                <div key={step.name} className="flex flex-col items-center text-center w-1/4">
                  <step.icon className={`h-6 w-6 mb-1 ${index <= currentStatusIndex ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span>{step.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-2">Items in this order</h3>
            <div className="space-y-4">
              {order.items.map((item: CartItemType) => (
                <div key={item.id + item.name} className="flex items-center gap-4 p-2 border rounded-md">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-secondary/20"> {/* Added background for letterboxing */}
                    <Image src={item.imageUrls[0]} alt={item.name} layout="fill" objectFit="contain" data-ai-hint={`${item.category.toLowerCase()} product small`}/> {/* Changed to contain */}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} - Price: NRS {item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-primary">NRS {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
              <div className="text-sm text-muted-foreground p-3 border rounded-md bg-secondary/30">
                <p>{order.shippingAddress.fullName}</p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                <p>{order.shippingAddress.street}, {order.shippingAddress.apartment}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
              <div className="text-sm space-y-1 p-3 border rounded-md bg-secondary/30">
                <div className="flex justify-between"><span>Subtotal:</span> <span>NRS {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span> <span>NRS {shippingCost.toFixed(2)}</span></div>
                {/* Tip might be implicitly included in totalAmount if saved that way, or shown explicitly */}
                {/* const tip = order.totalAmount - subtotal - shippingCost; // if tip is part of totalAmount */}
                {/* {tip > 0 && <div className="flex justify-between"><span>Tip:</span> <span>NRS {tip.toFixed(2)}</span></div>} */}
                <Separator className="my-1"/>
                <div className="flex justify-between font-bold text-base"><span>Total:</span> <span className="text-primary">NRS {order.totalAmount.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
          
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Order placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          <Button asChild variant="outline">
            <Link href="/orders/history">Back to Order History</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
