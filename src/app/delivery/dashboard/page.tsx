'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle2, PackageSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Order } from '@/types';

// Mock delivery data
const mockDeliveries: Partial<Order>[] = [
  { id: 'ORD789CRIMSON', status: 'Shipped', shippingAddress: { street: '456 Dark Oak Rd', city: 'Shadow Creek', state: 'DS', zipCode: '67890', country: 'Crimsonland'}, totalAmount: 150.75 },
  { id: 'ORD012CRIMSON', status: 'Processing', shippingAddress: { street: '789 Crimson Blvd', city: 'Ruby Valley', state: 'RB', zipCode: '01234', country: 'Crimsonland' }, totalAmount: 88.00 },
  { id: 'ORD345CRIMSON', status: 'Shipped', shippingAddress: { street: '101 Nightfall Ave', city: 'Moonlit Bay', state: 'MB', zipCode: '34567', country: 'Crimsonland' }, totalAmount: 210.50 },
];


export default function DeliveryDashboardPage() {
  const [deliveries, setDeliveries] = useState<Partial<Order>[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDeliveries(mockDeliveries.filter(d => d.status === 'Shipped' || d.status === 'Processing')); // Show active deliveries
  }, []);

  const handleMarkAsDelivered = (orderId: string | undefined) => {
    if(!orderId) return;
    setDeliveries(prev => prev.map(d => d.id === orderId ? {...d, status: 'Delivered'} : d).filter(d => d.status !== 'Delivered'));
    // In a real app, this would be an API call
    console.log(`Order ${orderId} marked as delivered`);
  };

  if (!isClient) {
    return <div className="text-center py-10">Loading delivery dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <Truck className="mr-3 h-8 w-8" /> Delivery Dashboard
          </CardTitle>
          <CardDescription>Manage your assigned deliveries.</CardDescription>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
             <div className="text-center py-10">
                <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">No active deliveries assigned.</p>
                <p className="text-sm text-muted-foreground">Check back later for new tasks.</p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>
                    <Badge variant={delivery.status === 'Shipped' ? 'default' : 'secondary'} 
                           className={delivery.status === 'Shipped' ? 'bg-primary/80' : ''}>
                      {delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {delivery.shippingAddress?.street}, {delivery.shippingAddress?.city}
                  </TableCell>
                  <TableCell className="text-right">${delivery.totalAmount?.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {delivery.status === 'Shipped' && (
                      <Button size="sm" onClick={() => handleMarkAsDelivered(delivery.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Delivered
                      </Button>
                    )}
                     {delivery.status === 'Processing' && (
                      <Button size="sm" variant="outline" disabled>
                        Awaiting Pickup
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
