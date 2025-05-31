
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
import { Separator } from '@/components/ui/separator';

// Helper component for Google Icon
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path fill="none" d="M1 1h22v22H1z" />
  </svg>
);


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const n8nWebhookUrl = 'https://n8n-pgfu.onrender.com:443/webhook-test/Webhook';

  const handleMagicLinkLogin = async (event: React.FormEvent<HTMLFormElement>) => {
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
      // Attempt to call the n8n webhook
      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!n8nResponse.ok) {
          console.warn('n8n webhook call failed or returned an error status:', n8nResponse.status);
          // Potentially show a non-critical toast, but proceed with Supabase OTP
        }
      } catch (n8nError) {
        console.warn('Could not reach n8n webhook:', n8nError);
        // Potentially show a non-critical toast, but proceed with Supabase OTP
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/`, // Redirect to home page after login
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Check your email!',
        description: `A magic link has been sent to ${email}. Click the link to log in. This link was sent by Supabase.`,
        duration: 9000,
      });
      setEmail('');

    } catch (error: any) {
      console.error('Supabase Magic Link Error:', error);
      const errorMessage = error.message || 'An error occurred during login. Please try again.';
      setAuthError(errorMessage);
      toast({ title: 'Login Failed', description: errorMessage, variant: 'destructive', duration: 9000 });
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setAuthError(null);
    if (!supabase) {
      setAuthError("Supabase client is not initialized. Check environment variables.");
      toast({ title: "Google Login Failed", description: "Supabase client is not initialized.", variant: "destructive" });
      setIsLoadingGoogle(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`, // Redirect to home page after successful Google login
      },
    });

    if (error) {
      console.error('Supabase Google OAuth Error:', error);
      setAuthError(error.message || 'An error occurred during Google login.');
      toast({ title: 'Google Login Failed', description: error.message, variant: 'destructive' });
      setIsLoadingGoogle(false);
    }
    // If no error, Supabase handles the redirect to Google and then back to your app.
    // isLoadingGoogle will remain true until the page reloads or navigates away.
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center mb-2">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Login or Sign Up
          </CardTitle>
          <CardDescription>
            Use Google or enter your email for a magic link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
            disabled={isLoadingGoogle || isLoading}
          >
            {isLoadingGoogle ? (
              'Redirecting to Google...'
            ) : (
              <>
                <GoogleIcon /> <span className="ml-2">Sign in with Google</span>
              </>
            )}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
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
                disabled={isLoading || isLoadingGoogle}
              />
            </div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button type="submit" className="w-full" disabled={isLoading || isLoadingGoogle || !email}>
              {isLoading ? 'Sending Link...' : 'Send Magic Link'}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="flex-col items-center space-y-2">
           <p className="text-xs text-muted-foreground px-6 text-center">
            No password needed! We use secure magic links or Google Sign-In.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

