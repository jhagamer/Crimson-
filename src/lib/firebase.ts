
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if essential Firebase config values are present
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error(
    'Firebase configuration error: API Key, Auth Domain, or Project ID is missing. ' +
    'Please ensure all NEXT_PUBLIC_FIREBASE_ environment variables are set correctly in your .env.local file ' +
    'and that you have restarted your development server.'
  );
  if (!firebaseConfig.apiKey) console.error("NEXT_PUBLIC_FIREBASE_API_KEY is missing or empty.");
  if (!firebaseConfig.authDomain) console.error("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing or empty.");
  if (!firebaseConfig.projectId) console.error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing or empty.");
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

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    // It's good practice to throw the error so the caller can handle it
    throw error;
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

// Export FirebaseUser type if needed elsewhere, though direct usage in components is more common
export type { FirebaseUser };
