
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';
import { mockOrderHistory as staticMockHistory } from '@/lib/mock-data'; 
import { ListOrdered, PackageSearch, PhoneCall, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const placedOrderKeys = Object.keys(localStorage).filter(key => key.startsWith('orderDetails_'));
    const placedOrdersFromStorage: Order[] = placedOrderKeys.map(key => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }).filter(Boolean) as Order[];
    
    const combinedOrders = [...placedOrdersFromStorage, ...staticMockHistory].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const uniqueOrdersMap = new Map<string, Order>();
    combinedOrders.forEach(order => {
      // Prioritize orders from localStorage (session placed) if IDs collide with static mock
      if (!uniqueOrdersMap.has(order.id) || placedOrderKeys.includes(`orderDetails_${order.id}`)) {
        uniqueOrdersMap.set(order.id, order);
      }
    });
    setOrders(Array.from(uniqueOrdersMap.values()));

  }, []);

  const handlePhoneConfirm = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, isPhoneConfirmed: true } : order
      )
    );
    // Update in localStorage if it was a session-placed order
    const orderToUpdateKey = `orderDetails_${orderId}`;
    const storedOrderData = localStorage.getItem(orderToUpdateKey);
    if (storedOrderData) {
      try {
        const order: Order = JSON.parse(storedOrderData);
        order.isPhoneConfirmed = true;
        localStorage.setItem(orderToUpdateKey, JSON.stringify(order));
      } catch (e) {
        console.error("Failed to update order in localStorage", e);
      }
    }

    toast({
      title: "Phone Confirmation (Mock)",
      description: `Order ${orderId} marked as phone confirmed.`,
    });
  };


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
          <CardDescription>Review your past and current orders. Confirm deliveries by phone.</CardDescription>
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
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">
                            Order ID: {order.id}
                            </CardTitle>
                            <CardDescription>
                            Placed on: {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </div>
                         <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                               className={order.status === 'Delivered' ? 'bg-green-600 text-white' : ''}>
                            {order.status}
                        </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3 space-y-2">
                    <p className="text-lg font-semibold text-primary">Total: NRS {order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Items: {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </p>
                     {order.trackingNumber && <p className="text-xs text-muted-foreground">Tracking: {order.trackingNumber}</p>}
                     <div className="flex items-center text-xs">
                        {order.isPhoneConfirmed ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="mr-1 h-3 w-3"/> Phone Confirmed
                            </Badge>
                        ) : (
                             <Badge variant="outline" className="text-amber-600 border-amber-600">
                                Awaiting Phone Confirmation
                            </Badge>
                        )}
                     </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0 pb-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                    {!order.isPhoneConfirmed && order.status !== 'Delivered' && (
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handlePhoneConfirm(order.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <PhoneCall className="mr-2 h-4 w-4" /> Confirm by Phone
                        </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
