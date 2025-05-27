
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
// 1. Ensure your .env.local file has the CORRECT Firebase project credentials.
// 2. In your Firebase Console (https://console.firebase.google.com/):
//    a. Go to Authentication -> Sign-in method.
//    b. Ensure "Email/Password" provider is ENABLED.
//    c. Add your application's domain(s) to the "Authorized domains" list.
//       This typically includes 'localhost' for local development and any
//       deployment domains (e.g., your-project.cloudworkstations.dev).

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Define more explicit placeholder values to check against
const placeholderValues = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE", 
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN_HERE",
  projectId: "YOUR_ACTUAL_PROJECT_ID_HERE", 
  // storageBucket and others can be checked too if strictly needed for core auth
};

let configError = false;

if (!configError) {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === placeholderValues.apiKey) {
    console.error(`Firebase Config Error: NEXT_PUBLIC_FIREBASE_API_KEY is missing or still set to the placeholder '${placeholderValues.apiKey}'. Please set it in your .env.local file and restart your server.`);
    configError = true;
  }
  if (!firebaseConfig.authDomain || firebaseConfig.authDomain === placeholderValues.authDomain) {
    console.error(`Firebase Config Error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing or still set to the placeholder '${placeholderValues.authDomain}'. Please update it in your .env.local file and restart your server.`);
    configError = true;
  }
  if (!firebaseConfig.projectId || firebaseConfig.projectId === placeholderValues.projectId) {
    console.error(`Firebase Config Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing or still set to the placeholder '${placeholderValues.projectId}'. Please update it in your .env.local file and restart your server.`);
    configError = true;
  }
}

if (configError) {
  console.error("---");
  console.error("IMPORTANT: If you've just updated your .env.local file with actual Firebase credentials, you MUST RESTART your Next.js development server for the changes to take effect.");
  console.error("Firebase initialization might fail due to the configuration issues listed above.");
  console.error("Also, ensure Email/Password sign-in is enabled and your app domain (e.g., localhost, your-deployment-domain.com) is an 'Authorized domain' in your Firebase project's Authentication settings page in the Firebase Console.");
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
// Google Provider is kept for now, but not used in the primary login flow
export const googleProvider = new GoogleAuthProvider(); 

const DUMMY_PASSWORD_FOR_OTP_PROTOTYPE = "prototypeOtpLoginPassword123!";

export const signInOrUpWithOtpEmail = async (email: string): Promise<FirebaseUser> => {
  try {
    // Try to sign in first
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, DUMMY_PASSWORD_FOR_OTP_PROTOTYPE);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      // If user not found or generic invalid credential (which can happen if password is wrong for an existing user,
      // but for our dummy password flow, we assume it means new user), try to create a new user.
      try {
        const newUserCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, DUMMY_PASSWORD_FOR_OTP_PROTOTYPE);
        return newUserCredential.user;
      } catch (signUpError: any) {
        console.error("Error creating user during OTP flow: ", signUpError);
        throw signUpError; // Re-throw sign-up error
      }
    } else {
      console.error("Error signing in during OTP flow: ", error);
      throw error; // Re-throw other sign-in errors
    }
  }
};


export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export type { FirebaseUser };
// Export original email/password functions if they might be needed elsewhere, or remove if truly unused.
// For now, keeping them commented out as the primary flow changed.
// export const signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;
// export const signUpWithEmailAndPassword = firebaseCreateUserWithEmailAndPassword;
