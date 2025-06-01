
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { supabase, type SupabaseUser } from '@/lib/supabaseClient';
import { Mail, LogIn, UserCircle, KeyRound, Briefcase } from 'lucide-react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isLoadingMagicLink, setIsLoadingMagicLink] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [staffEmail, setStaffEmail] = useState(''); // Changed from staffUsername
  const [staffPassword, setStaffPassword] = useState('');
  const [isLoadingStaffLogin, setIsLoadingStaffLogin] = useState(false);

  const n8nWebhookUrl = 'https://n8n-pgfu.onrender.com:443/webhook-test/Webhook';
  const adminEmailForRedirect = 'jhagamernp098@gmail.com';
  const workerEmailForRedirect = 'worker@example.com'; // Example worker email

  useEffect(() => {
    if (!supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          toast({
            title: 'Login Successful',
            description: `Welcome, ${session.user.email}!`,
          });
          // Redirection logic
          if (session.user.email === adminEmailForRedirect) {
            router.push('/admin/products');
          } else if (session.user.email === workerEmailForRedirect) {
            // This is a simplified check. Ideally, check app_metadata.role
            router.push('/delivery/dashboard');
          } else {
            router.push('/'); 
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, toast]);


  const handleMagicLinkLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoadingMagicLink(true);
    setAuthError(null);

    if (!email) {
      setAuthError("Email is required.");
      toast({ title: "Login Failed", description: "Email is required.", variant: "destructive" });
      setIsLoadingMagicLink(false);
      return;
    }

    if (!supabase) {
      setAuthError("Supabase client is not initialized.");
      toast({ title: "Login Failed", description: "Supabase client is not initialized.", variant: "destructive" });
      setIsLoadingMagicLink(false);
      return;
    }

    try {
      await fetch(n8nWebhookUrl, { method: 'POST', body: JSON.stringify({ event: 'magic_link_attempt', email }), headers: { 'Content-Type': 'application/json'} });
    } catch (n8nError) {
      console.warn('Could not reach n8n webhook for magic link:', n8nError);
      toast({ title: 'Notification Service Unavailable', description: 'Could not log login attempt, but proceeding.', variant: 'default', duration: 3000 });
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast({
        title: 'Check your email!',
        description: `A magic link has been sent to ${email}. Click the link to log in.`,
        duration: 9000,
      });
      setEmail('');
    } catch (error: any) {
      console.error('Supabase Magic Link Error:', error);
      const errorMessage = error.message || 'An error occurred. Please try again.';
      setAuthError(errorMessage);
      toast({ title: 'Magic Link Failed', description: errorMessage, variant: 'destructive' });
    }
    setIsLoadingMagicLink(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setAuthError(null);
    if (!supabase) {
      setAuthError("Supabase client is not initialized.");
      toast({ title: "Google Login Failed", description: "Supabase client is not initialized.", variant: "destructive" });
      setIsLoadingGoogle(false);
      return;
    }
    try {
        await fetch(n8nWebhookUrl, { method: 'POST', body: JSON.stringify({ event: 'google_login_attempt' }), headers: { 'Content-Type': 'application/json'} });
    } catch (n8nError) {
      console.warn('Could not reach n8n webhook for Google login:', n8nError);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      console.error('Supabase Google OAuth Error:', error);
      setAuthError(error.message || 'An error occurred.');
      toast({ title: 'Google Login Failed', description: error.message, variant: 'destructive' });
      setIsLoadingGoogle(false); 
    }
    // setIsLoadingGoogle(false); // Loading will be true until redirect or error
  };

  const handleStaffLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoadingStaffLogin(true);
    setAuthError(null);

    if (!staffEmail || !staffPassword) {
        setAuthError("Staff Email and password are required.");
        toast({ title: "Staff Login Failed", description: "Email and password are required.", variant: "destructive" });
        setIsLoadingStaffLogin(false);
        return;
    }

    if (!supabase) {
      setAuthError("Supabase client is not initialized.");
      toast({ title: "Login Failed", description: "Supabase client is not initialized.", variant: "destructive" });
      setIsLoadingStaffLogin(false);
      return;
    }

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: staffEmail,
        password: staffPassword,
      });

      if (error) throw error;

      // Successful login will trigger onAuthStateChange which handles redirection.
      // No explicit redirection here to avoid race conditions with the auth listener.
      toast({
          title: "Staff Login Attempted",
          description: `Checking credentials for ${staffEmail}...`,
      });
      // Clear form, or let onAuthStateChange handle it.
      // setStaffEmail('');
      // setStaffPassword('');

    } catch (error: any) {
      console.error('Supabase Staff Login Error:', error);
      const errorMessage = error.message || 'Invalid email or password.';
      setAuthError(errorMessage);
      toast({ title: "Staff Login Failed", description: errorMessage, variant: "destructive" });
    }
    setIsLoadingStaffLogin(false);
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
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="customer" className="space-y-4 pt-4">
              <CardDescription className="text-center">
                Use Google or enter your email for a magic link.
              </CardDescription>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleLogin}
                disabled={isLoadingGoogle || isLoadingMagicLink || isLoadingStaffLogin}
              >
                {isLoadingGoogle ? 'Redirecting to Google...' : <><GoogleIcon /> <span className="ml-2">Sign in with Google</span></>}
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or with email</span>
                </div>
              </div>
              <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="flex items-center mb-1">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email Address
                  </Label>
                  <Input
                    id="email" type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    disabled={isLoadingMagicLink || isLoadingGoogle || isLoadingStaffLogin}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoadingMagicLink || isLoadingGoogle || isLoadingStaffLogin || !email}>
                  {isLoadingMagicLink ? 'Sending Link...' : 'Send Magic Link'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="staff" className="space-y-4 pt-4">
               <CardDescription className="text-center">
                Authorized personnel login (e.g., Delivery, Admin).
              </CardDescription>
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div>
                  <Label htmlFor="staffEmail" className="flex items-center mb-1">
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Staff Email
                  </Label>
                  <Input
                    id="staffEmail" type="email" placeholder="staff.member@example.com" value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)} required
                    disabled={isLoadingStaffLogin || isLoadingGoogle || isLoadingMagicLink}
                  />
                </div>
                <div>
                  <Label htmlFor="staffPassword" className="flex items-center mb-1">
                    <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" /> Password
                  </Label>
                  <Input
                    id="staffPassword" type="password" placeholder="••••••••" value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)} required
                    disabled={isLoadingStaffLogin || isLoadingGoogle || isLoadingMagicLink}
                  />
                </div>
                <Button type="submit" className="w-full btn-primary-gradient" disabled={isLoadingStaffLogin || isLoadingGoogle || isLoadingMagicLink || !staffEmail || !staffPassword}>
                  {isLoadingStaffLogin ? 'Logging In...' : 'Staff Login'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          {authError && <p className="text-sm text-destructive text-center pt-2">{authError}</p>}
        </CardContent>
         <CardFooter className="flex-col items-center space-y-2">
           <p className="text-xs text-muted-foreground px-6 text-center">
            Customer login uses secure magic links or Google Sign-In. Staff login is for authorized personnel only.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
