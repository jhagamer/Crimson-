
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Address } from '@/types';

export default function AddressPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({
    fullName: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      try {
        setCurrentAddress(JSON.parse(savedAddress));
      } catch (e) {
        console.error("Failed to parse saved address:", e);
      }
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setCurrentAddress(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Basic validation
    if (!currentAddress.street || !currentAddress.city || !currentAddress.state || !currentAddress.zipCode || !currentAddress.country || !currentAddress.fullName || !currentAddress.phone) {
        toast({
            title: 'Missing Information',
            description: 'Please fill out all required address fields, including full name and phone number.',
            variant: 'destructive',
        });
        return;
    }
    localStorage.setItem('shippingAddress', JSON.stringify(currentAddress));
    toast({
      title: 'Address Saved',
      description: 'Your shipping address has been updated.',
    });
    // Redirect to checkout or profile page, or wherever appropriate
    const redirectPath = localStorage.getItem('addressRedirectPath') || '/checkout';
    localStorage.removeItem('addressRedirectPath'); // Clean up
    router.push(redirectPath);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Shipping Address</CardTitle>
          <CardDescription>Manage your shipping information for faster checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" value={currentAddress.fullName || ''} onChange={handleChange} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" type="tel" value={currentAddress.phone || ''} onChange={handleChange} required/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" placeholder="123 Crimson Lane" value={currentAddress.street || ''} onChange={handleChange} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
              <Input id="apartment" placeholder="Apt 4B" value={currentAddress.apartment || ''} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="New York" value={currentAddress.city || ''} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" placeholder="NY" value={currentAddress.state || ''} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                <Input id="zipCode" placeholder="10001" value={currentAddress.zipCode || ''} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="United States" value={currentAddress.country || ''} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full">
              Save Address
            </Button>
          </form>
        </CardContent>
         <CardFooter>
          <p className="text-xs text-muted-foreground">
            Your information is saved securely.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
