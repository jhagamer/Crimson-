
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/firebase';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

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
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <Chrome className="mr-2 h-5 w-5" /> {/* Using Chrome as a generic Google icon placeholder */}
            Sign in with Google
          </Button>
        </CardContent>
        {/* Footer removed as sign-up and forgot password links are no longer relevant */}
      </Card>
    </div>
  );
}
