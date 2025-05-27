
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Order } from '@/types';
import { mockOrderHistory as staticMockHistory } from '@/lib/mock-data'; // Using mock products for cart items
import { ListOrdered, PackageSearch } from 'lucide-react';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, fetch user's orders.
    // For this mock, we'll combine static history with any orders "placed" in this session.
    const placedOrderKeys = Object.keys(localStorage).filter(key => key.startsWith('orderDetails_'));
    const placedOrdersFromStorage: Order[] = placedOrderKeys.map(key => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }).filter(Boolean) as Order[];
    
    // Combine and sort by date (newest first)
    const combinedOrders = [...placedOrdersFromStorage, ...staticMockHistory].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Remove duplicates by ID, keeping the one from localStorage if it exists (more recent)
    const uniqueOrders = Array.from(new Map(combinedOrders.map(order => [order.id, order])).values());

    setOrders(uniqueOrders);
  }, []);

  if (!isClient) {
    return <div className="text-center py-10">Loading order history...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <ListOrdered className="mr-3 h-8 w-8" /> Your Order History
          </CardTitle>
          <CardDescription>Review your past and current orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-16">
                <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">You haven't placed any orders yet.</p>
              <Button asChild className="mt-4">
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex justify-between items-center">
                      <span>Order ID: {order.id}</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' 
                        : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' 
                        : order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-muted text-muted-foreground'
                      }`}>
                        {order.status}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    <p className="text-lg font-semibold text-primary">Total: NRS {order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Items: {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </p>
                     {order.trackingNumber && <p className="text-xs text-muted-foreground">Tracking: {order.trackingNumber}</p>}
                  </CardContent>
                  <CardContent className="pt-0 pb-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
