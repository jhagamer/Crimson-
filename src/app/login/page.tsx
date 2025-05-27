
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signInOrUpWithOtpEmail } from '@/lib/firebase'; // Updated import
import { Mail, ShieldCheck, LogIn } from 'lucide-react';

type AuthStep = 'email' | 'otp';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [authStep, setAuthStep] = useState<AuthStep>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const MOCK_OTP = "123456"; // This remains for simulation

  const resetFormFields = () => {
    // Email is kept for the OTP step
    setOtp('');
    setAuthError(null);
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (!email) {
      setAuthError("Email is required.");
      toast({ title: "Login Failed", description: "Email is required.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Simulate OTP request
    toast({
      title: 'OTP Sent (Mock)',
      description: `If your email is valid, an OTP (mock: ${MOCK_OTP}) has been 'sent' to ${email}.`,
    });
    setAuthStep('otp');
    setIsLoading(false);
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (otp !== MOCK_OTP) {
      const otpError = `Invalid OTP. Please try again (mock OTP is ${MOCK_OTP}).`;
      setAuthError(otpError);
      toast({
        title: 'OTP Verification Failed',
        description: otpError,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await signInOrUpWithOtpEmail(email); // Use the new Firebase utility
      toast({
        title: 'Login Successful!',
        description: `Welcome! You are now logged in.`,
      });
      router.push('/'); // Redirect to home page
    } catch (error: any) {
      console.error('OTP Login/Signup Error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      if (error.code) { // Firebase errors usually have a code
        errorMessage = error.message; // Use Firebase's error message
      }
      setAuthError(errorMessage);
      toast({ title: 'Login Failed', description: errorMessage, variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const renderEmailForm = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
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
      {authError && authStep === 'email' && <p className="text-sm text-destructive">{authError}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Send OTP'}
      </Button>
    </form>
  );

  const renderOtpForm = () => (
     <form onSubmit={handleOtpSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        An OTP (mock: <strong className="text-primary">{MOCK_OTP}</strong>) was 'sent' to <strong>{email}</strong>.
      </p>
      <div>
        <Label htmlFor="otp" className="flex items-center mb-1">
          <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" /> One-Time Password
        </Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          disabled={isLoading}
          maxLength={6}
        />
      </div>
      {authError && authStep === 'otp' && <p className="text-sm text-destructive">{authError}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Login with OTP'}
      </Button>
      <Button 
        variant="link" 
        onClick={() => { setAuthStep('email'); resetFormFields(); }} 
        className="w-full text-sm" 
        disabled={isLoading}
      >
        Back to Email Entry
      </Button>
    </form>
  );

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
            {authStep === 'email'
              ? 'Enter your email to receive a One-Time Password (OTP).'
              : `Enter the OTP 'sent' to your email (mock: ${MOCK_OTP}).`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {authStep === 'email' ? renderEmailForm() : renderOtpForm()}
        </CardContent>
         <CardFooter className="flex-col items-center space-y-2">
           <p className="text-xs text-muted-foreground px-6 text-center">
            This is a prototype. OTPs are mocked and no actual emails are sent. Accounts are created if they don't exist upon OTP verification.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
