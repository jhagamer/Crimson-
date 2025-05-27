
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Direct import for signInWithEmailAndPassword
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Mail, KeyRound, ShieldCheck } from 'lucide-react';

type LoginStep = 'credentials' | 'otp';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleCredentialSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User is now authenticated with Firebase
      toast({
        title: 'Credentials Accepted',
        description: 'An OTP has been (mock) sent to your email. Please enter it below.',
      });
      setLoginStep('otp');
    } catch (error: any) {
      console.error('Email/Password Sign-In Error:', error);
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      }
      setAuthError(errorMessage);
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // Mock OTP verification
    const MOCK_OTP = "123456"; // In a real app, this would be generated and verified server-side
    if (otp === MOCK_OTP) {
      toast({
        title: 'Login Successful!',
        description: `Welcome back!`,
      });
      router.push('/');
    } else {
      setAuthError('Invalid OTP. Please try again (mock OTP is 123456).');
      toast({
        title: 'OTP Verification Failed',
        description: 'The OTP entered is incorrect (mock OTP is 123456).',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Login</CardTitle>
          <CardDescription>
            {loginStep === 'credentials'
              ? 'Access your Crimson Commerce account with your email and password.'
              : 'Enter the OTP sent to your email (mock: 123456).'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loginStep === 'credentials' && (
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center mb-1">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
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
              <div>
                <Label htmlFor="password" className="flex items-center mb-1">
                  <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {authError && <p className="text-sm text-destructive">{authError}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          )}

          {loginStep === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="flex items-center mb-1">
                  <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" /> One-Time Password
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP (e.g., 123456)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={isLoading}
                  maxLength={6}
                />
                 <p className="text-xs text-muted-foreground mt-1">Mock OTP is 123456</p>
              </div>
              {authError && loginStep === 'otp' && <p className="text-sm text-destructive">{authError}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
              </Button>
               <Button variant="link" onClick={() => { setLoginStep('credentials'); setAuthError(null); setOtp('');}} className="w-full text-sm" disabled={isLoading}>
                Back to Email/Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
