
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, KeyRound, UserCircle } from 'lucide-react'; // Added UserCircle for username

export default function AdminWorkersPage() {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!username || !password) {
        toast({
            title: "Error",
            description: "Username and password are required.",
            variant: "destructive",
        });
        return;
    }
    
    // Mock worker creation logic
    console.log('Simulating worker creation:', { username, password });
    
    toast({
      title: 'Worker Account Creation Simulated',
      description: `Worker account for username "${username}" creation simulated. Backend integration with Supabase (creating user with email/password and assigning role/metadata) is required for actual functionality.`,
      duration: 7000,
    });
    
    // Clear form
    setUsername('');
    setPassword('');
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Manage Delivery Workers</CardTitle>
              <CardDescription>Add new delivery worker accounts (Username/Password).</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Worker Username
              </Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="e.g., delivery_hero_01" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              Add Worker (Simulated)
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            This interface simulates worker creation. Actual user management requires backend integration with Supabase to create users, assign roles (e.g., 'delivery'), and securely store credentials.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
