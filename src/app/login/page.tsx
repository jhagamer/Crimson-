
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { auth, signInWithEmailAndPassword, signUpWithEmailAndPassword } from '@/lib/firebase';
import { Mail, KeyRound, ShieldCheck, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AuthMode = 'login' | 'signup';
type AuthStep = 'credentials' | 'otp';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authStep, setAuthStep] = useState<AuthStep>('credentials');
  
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const MOCK_OTP = "123456";

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setAuthError(null);
  };

  const handleModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthStep('credentials'); // Reset to credentials step when mode changes
    resetFormFields();
  };

  const handleCredentialSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        toast({ title: "Sign Up Failed", description: "Passwords do not match.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      try {
        await signUpWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Account Created',
          description: `Verification OTP (mock: ${MOCK_OTP}) has been 'sent' to ${email}. Please enter it below.`,
        });
        setAuthStep('otp');
      } catch (error: any) {
        console.error('Sign-Up Error:', error);
        let errorMessage = 'Sign-up failed. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email address is already in use.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. It should be at least 6 characters.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'The email address is not valid.';
        }
        setAuthError(errorMessage);
        toast({ title: 'Sign Up Failed', description: errorMessage, variant: 'destructive' });
      }
    } else { // Login mode
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Credentials Accepted',
          description: `An OTP (mock: ${MOCK_OTP}) has been 'sent' to your email. Please enter it below.`,
        });
        setAuthStep('otp');
      } catch (error: any) {
        console.error('Email/Password Sign-In Error:', error);
        let errorMessage = 'Login failed. Please check your credentials and try again.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid email or password.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'The email address is not valid.';
        }
        setAuthError(errorMessage);
        toast({ title: 'Login Failed', description: errorMessage, variant: 'destructive' });
      }
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (otp === MOCK_OTP) {
      toast({
        title: authMode === 'login' ? 'Login Successful!' : 'Account Verified!',
        description: `Welcome!`,
      });
      router.push('/'); // Redirect to home page after successful OTP
    } else {
      const otpError = `Invalid OTP. Please try again (mock OTP is ${MOCK_OTP}).`;
      setAuthError(otpError);
      toast({
        title: 'OTP Verification Failed',
        description: otpError,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const renderCredentialForm = () => (
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
          minLength={6}
          disabled={isLoading}
        />
      </div>
      {authMode === 'signup' && (
        <div>
          <Label htmlFor="confirmPassword" className="flex items-center mb-1">
            <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" /> Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>
      )}
      {authError && authStep === 'credentials' && <p className="text-sm text-destructive">{authError}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? (authMode === 'login' ? 'Signing In...' : 'Creating Account...')
          : (authMode === 'login' ? 'Sign In' : 'Create Account')}
      </Button>
    </form>
  );

  const renderOtpForm = () => (
     <form onSubmit={handleOtpSubmit} className="space-y-4">
      <div>
        <Label htmlFor="otp" className="flex items-center mb-1">
          <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" /> One-Time Password
        </Label>
        <Input
          id="otp"
          type="text"
          placeholder={`Enter OTP (e.g., ${MOCK_OTP})`}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          disabled={isLoading}
          maxLength={6}
        />
        <p className="text-xs text-muted-foreground mt-1">Mock OTP is {MOCK_OTP}</p>
      </div>
      {authError && authStep === 'otp' && <p className="text-sm text-destructive">{authError}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify OTP & Proceed'}
      </Button>
      <Button 
        variant="link" 
        onClick={() => { setAuthStep('credentials'); setAuthError(null); setOtp('');}} 
        className="w-full text-sm" 
        disabled={isLoading}
      >
        Back to Credentials
      </Button>
    </form>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            {authMode === 'login' ? 'Login' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {authStep === 'credentials'
              ? (authMode === 'login' ? 'Access your Crimson Commerce account.' : 'Create a new Crimson Commerce account.')
              : `Enter the OTP 'sent' to your email (mock: ${MOCK_OTP}).`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={authMode} onValueChange={(value) => handleModeChange(value as AuthMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-6">
              {authStep === 'credentials' ? renderCredentialForm() : renderOtpForm()}
            </TabsContent>
            <TabsContent value="signup" className="pt-6">
               {authStep === 'credentials' ? renderCredentialForm() : renderOtpForm()}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex-col items-center space-y-2">
           <p className="text-xs text-muted-foreground px-6 text-center">
            This is a prototype. OTPs are mocked and no actual emails are sent.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
