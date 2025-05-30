
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signInOrUpWithOtpEmail } from '@/lib/firebase'; 
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

  // IMPORTANT: This is a MOCK OTP for prototyping.
  // In a real production application, OTPs must be securely generated,
  // sent via a backend service (e.g., SMS/email), and verified on the server.
  // Your n8n workflow is intended to handle the actual sending.
  const MOCK_OTP = "123456"; 
  const n8nWebhookUrl = 'https://n8n-pgfu.onrender.com:443/webhook-test/Webhook';


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

    try {
      // Attempt to call the n8n webhook to trigger sending an OTP email
      const webhookResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!webhookResponse.ok) {
        console.error('n8n webhook call failed:', webhookResponse.status, await webhookResponse.text());
        toast({
          title: 'OTP Service Issue (n8n)',
          description: `Failed to trigger the OTP email via n8n webhook (${n8nWebhookUrl}). Please check your n8n workflow. Using fallback mock OTP for this prototype: ${MOCK_OTP}.`,
          variant: "default", 
        });
      } else {
         toast({
          title: 'OTP Email Triggered (n8n)',
          description: `An OTP request for ${email} was sent to the n8n webhook (${n8nWebhookUrl}). Your n8n workflow should now send an email with the OTP. For this prototype, the mock OTP to enter is ${MOCK_OTP}.`,
        });
      }
    } catch (error) {
      console.error('Error calling n8n webhook:', error);
      toast({
        title: 'OTP Service Error (n8n)',
        description: `Could not reach the n8n webhook (${n8nWebhookUrl}) to send OTP email. Please check network and n8n service. Using fallback mock OTP for this prototype: ${MOCK_OTP}.`,
        variant: "default",
      });
    }

    // Regardless of webhook outcome (for prototype), proceed to OTP entry step with mock OTP
    setAuthStep('otp');
    setIsLoading(false);
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (otp !== MOCK_OTP) {
      const otpError = `Invalid OTP. For this prototype, the mock OTP is ${MOCK_OTP}.`;
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
      await signInOrUpWithOtpEmail(email); 
      toast({
        title: 'Login Successful!',
        description: `Welcome! You are now logged in.`,
      });
      router.push('/'); 
    } catch (error: any) {
      console.error('OTP Login/Signup Error:', error);
      let errorMessage = error.message || 'An error occurred. Please try again.';
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/invalid-api-key') {
          errorMessage = "Firebase authentication is not configured correctly. Please check Firebase console (Sign-in methods, Authorized domains) and ensure your API keys are correct in .env.local and the server restarted.";
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
        An OTP request for <strong>{email}</strong> was triggered via n8n. 
        Your n8n workflow should send the actual OTP. For this prototype, enter the mock OTP: <strong className="text-primary">{MOCK_OTP}</strong>.
      </p>
      <div>
        <Label htmlFor="otp" className="flex items-center mb-1">
          <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" /> One-Time Password (Mock)
        </Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter Mock OTP"
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
              ? 'Enter your email. An OTP request will be sent via n8n (mocked for this prototype).'
              : `Enter the OTP. Your n8n workflow is responsible for sending the actual OTP. (Mock for prototype: ${MOCK_OTP}).`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {authStep === 'email' ? renderEmailForm() : renderOtpForm()}
        </CardContent>
         <CardFooter className="flex-col items-center space-y-2">
           <p className="text-xs text-muted-foreground px-6 text-center">
            This prototype triggers an n8n webhook to simulate an OTP request. 
            The actual email sending logic should be in your n8n workflow. 
            A mock OTP is used for frontend verification.
            Accounts are automatically created if they don't exist upon mock OTP verification using a dummy password.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
