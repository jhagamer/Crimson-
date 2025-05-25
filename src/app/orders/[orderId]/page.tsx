
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Order, CartItemType } from '@/types';
import { PackageCheck, ShoppingBag, Truck, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Mock order data - in a real app, this would be fetched
const mockOrder: Order = {
  id: 'ORD12345CRIMSON',
  items: [
    { id: '1', name: 'Crimson Velvet Armchair', description: '', price: 399.99, imageUrl: 'https://placehold.co/100x100.png', stock: 0, category: 'Furniture', quantity: 1 },
    { id: '3', name: 'Charcoal Gray Throw Pillow', description: '', price: 29.99, imageUrl: 'https://placehold.co/100x100.png', stock: 0, category: 'Decor', quantity: 2 },
  ],
  totalAmount: 459.97,
  status: 'Shipped', // 'Pending', 'Processing', 'Shipped', 'Delivered'
  shippingAddress: {
    street: '123 Crimson Ave',
    city: 'Redtown',
    state: 'CR',
    zipCode: '54321',
    country: 'Crimsonland',
  },
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  trackingNumber: 'CRMSNTRK987654321',
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

  useEffect(() => {
    setIsClient(true);
    // Simulate fetching order details. params.orderId can be used here.
    setOrder(mockOrder); 
  }, [params.orderId]);

  if (!isClient || !order) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  const currentStatusIndex = statusSteps.findIndex(step => step.name === order.status);
  const progressValue = statusSteps[currentStatusIndex]?.progress ?? 0;
  const shippingCost = 50.00; // Example shipping cost, ensure consistency if shown elsewhere
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // Example 10% tax


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
              {statusSteps.map((step) => (
                <div key={step.name} className="flex flex-col items-center">
                  <step.icon className={`h-6 w-6 mb-1 ${statusSteps.findIndex(s => s.name === step.name) <= currentStatusIndex ? 'text-primary' : 'text-muted-foreground'}`} />
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
                <div key={item.id} className="flex items-center gap-4 p-2 border rounded-md">
                  <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-cover" data-ai-hint={`${item.category.toLowerCase()} item small`}/>
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
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
              <div className="text-sm space-y-1 p-3 border rounded-md bg-secondary/30">
                <div className="flex justify-between"><span>Subtotal:</span> <span>NRS {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span> <span>NRS {shippingCost.toFixed(2)}</span></div>
                 <div className="flex justify-between"><span>Tax (10%):</span> <span>NRS {tax.toFixed(2)}</span></div>
                <Separator className="my-1"/>
                <div className="flex justify-between font-bold text-base"><span>Total:</span> <span className="text-primary">NRS {order.totalAmount.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
          
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Order placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
        </CardFooter>
      </Card>
    </div>
  );
}

