
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser, 
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword
} from 'firebase/auth';

// IMPORTANT:
// For Firebase Authentication to work:
// 1. Ensure your environment variables (e.g., in .env.local for development, 
//    or your production environment's settings) have the CORRECT Firebase project credentials.
// 2. In your Firebase Console (https://console.firebase.google.com/):
//    a. Go to Authentication -> Sign-in method.
//    b. Ensure "Email/Password" provider is ENABLED (used by the OTP-like flow).
//    c. Add your application's domain(s) to the "Authorized domains" list.
//       This typically includes 'localhost' for local development and any
//       deployment domains (e.g., your-project.firebaseapp.com, your-project.cloudworkstations.dev).

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let configError = false;

// Basic check for missing essential configuration
if (!firebaseConfig.apiKey) {
  console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_API_KEY is missing or empty. Please set it in your environment and restart your server.");
  configError = true;
}
if (!firebaseConfig.authDomain) {
  console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing or empty. Please set it in your environment and restart your server.");
  configError = true;
}
if (!firebaseConfig.projectId) {
  console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing or empty. Please set it in your environment and restart your server.");
  configError = true;
}


if (configError) {
  console.error("---");
  console.error("CRITICAL: Firebase initialization might fail due to the configuration issues listed above.");
  console.error("Please ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set.");
  console.error("Also, check Firebase console: Email/Password sign-in must be enabled, and your app domain(s) must be in 'Authorized domains'.");
  console.error("---");
}

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 

// This dummy password is used ONLY for the OTP prototype flow to interact with Firebase Auth.
// In a real production app, a secure passwordless mechanism (e.g., Firebase Custom Auth with a backend) would be used.
const DUMMY_PASSWORD_FOR_OTP_PROTOTYPE = "prototypeOtpLoginPassword123!";

export const signInOrUpWithOtpEmail = async (email: string): Promise<FirebaseUser> => {
  if (configError) {
    throw new Error("Firebase is not configured correctly. Check server logs.");
  }
  try {
    // Try to sign in first
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, DUMMY_PASSWORD_FOR_OTP_PROTOTYPE);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      // If user not found or generic invalid credential (which can happen if password is wrong for an existing user,
      // but for our dummy password flow, we assume it means new user or existing user with dummy pass), try to create a new user.
      try {
        const newUserCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, DUMMY_PASSWORD_for_OTP_PROTOTYPE);
        return newUserCredential.user;
      } catch (signUpError: any) {
        console.error("Error creating user during OTP flow: ", signUpError);
        // Provide a more user-friendly error or re-throw a generic one for production
        throw new Error("Could not sign up or log in. Please try again."); 
      }
    } else {
      console.error("Error signing in during OTP flow: ", error);
      // Provide a more user-friendly error or re-throw a generic one for production
      throw new Error("Login failed. Please try again.");
    }
  }
};


export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error; // Or handle more gracefully
  }
};

export type { FirebaseUser };
// export const signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;
// export const createUserWithEmailAndPassword = firebaseCreateUserWithEmailAndPassword;
