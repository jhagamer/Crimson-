'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/firebase'; // Import Google Sign-In function
import { Separator } from '@/components/ui/separator';
import { Chrome } from 'lucide-react'; // Example Google icon

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Mock login logic
    console.log('Email/Password Login attempt');
    toast({
      title: 'Login Successful (Mock)',
      description: 'You are now logged in (Email/Password).',
    });
    router.push('/'); // Redirect to home page after mock login
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        toast({
          title: 'Login Successful!',
          description: `Welcome, ${user.displayName || user.email}!`,
        });
        router.push('/');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Login</CardTitle>
          <CardDescription>Access your Crimson Commerce account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full">
              Login with Email
            </Button>
          </form>
          
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
              OR
            </span>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <Chrome className="mr-2 h-5 w-5" /> {/* Using Chrome as a generic Google icon placeholder */}
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="/forgot-password" passHref>
             <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">Forgot password?</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
