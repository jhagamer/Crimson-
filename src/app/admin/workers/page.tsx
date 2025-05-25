
'use client';

import { useState }
from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, KeyRound } from 'lucide-react';

export default function AdminWorkersPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Mock worker creation logic
    console.log('Attempting to create worker:', { email, password });

    // In a real app, you would use Firebase Admin SDK (backend) or Firebase client SDK
    // For client-side, it would be createUserWithEmailAndPassword, then assign a custom claim for role (requires backend).
    // Since this is a mock:
    if (!email || !password) {
        toast({
            title: "Error",
            description: "Email and password are required.",
            variant: "destructive",
        });
        return;
    }
    
    toast({
      title: 'Worker Account Created (Mock)',
      description: `Worker account for ${email} has been created with a mock password.`,
    });
    
    // Clear form
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Manage Workers</CardTitle>
              <CardDescription>Add new delivery worker accounts.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Worker Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="worker@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" /> Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full">
              Add Worker
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            This is a mock interface. In a real application, creating users and assigning roles would involve secure backend operations.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
