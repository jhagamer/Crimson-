
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { supabase, type SupabaseUser } from '@/lib/supabaseClient';
import { Mail, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (!email) {
      setAuthError("Email is required.");
      toast({ title: "Login Failed", description: "Email is required.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (!supabase) {
        setAuthError("Supabase client is not initialized. Check environment variables.");
        toast({ title: "Login Failed", description: "Supabase client is not initialized.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin, // Or your desired redirect URL after magic link click
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Check your email!',
        description: `A magic link has been sent to ${email}. Click the link to log in.`,
        duration: 9000,
      });
      // Typically, you would show a message here and wait for the user to click the link.
      // The user will be redirected to the app with a session after clicking the magic link.
      // For this prototype, we'll just clear the email field.
      setEmail('');

    } catch (error: any) {
      console.error('Supabase Magic Link Error:', error);
      const errorMessage = error.message || 'An error occurred during login. Please try again.';
      setAuthError(errorMessage);
      toast({ title: 'Login Failed', description: errorMessage, variant: 'destructive', duration: 9000 });
    }
    setIsLoading(false);
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center mb-2">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Login
          </CardTitle>
          <CardDescription>
            Enter your email to receive a magic link to log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center mb-1">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button type="submit" className="w-full" disabled={isLoading || !email}>
              {isLoading ? 'Sending Link...' : 'Send Magic Link'}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="flex-col items-center space-y-2">
           <p className="text-xs text-muted-foreground px-6 text-center">
            Supabase will send a magic link to your email. Clicking it will log you in and create an account if it doesn't exist.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
