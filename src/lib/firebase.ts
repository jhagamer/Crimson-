
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

const placeholderValues = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let configError = false;

if (firebaseConfig.apiKey === placeholderValues.apiKey) {
  console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_API_KEY is still set to the placeholder 'YOUR_API_KEY'. Please update it in your .env.local file with your actual Firebase API Key and restart your development server.");
  configError = true;
}
if (firebaseConfig.authDomain === placeholderValues.authDomain) {
  console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is still set to the placeholder 'YOUR_AUTH_DOMAIN'. Please update it in your .env.local file and restart your server.");
  configError = true;
}
if (firebaseConfig.projectId === placeholderValues.projectId) {
  console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is still set to the placeholder 'YOUR_PROJECT_ID'. Please update it in your .env.local file and restart your server.");
  configError = true;
}
// You can add similar checks for other optional placeholder values if needed.

// Check for missing essential values if no placeholder error was detected for them specifically
if (!configError) {
  if (!firebaseConfig.apiKey) {
    console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_API_KEY is missing or empty. Please set it in your .env.local file and restart your server.");
    configError = true;
  }
  if (!firebaseConfig.authDomain) {
    console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing or empty. Please set it in your .env.local file and restart your server.");
    configError = true;
  }
  if (!firebaseConfig.projectId) {
    console.error("Firebase Config Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing or empty. Please set it in your .env.local file and restart your server.");
    configError = true;
  }
}

if (configError) {
  console.error("---");
  console.error("IMPORTANT: If you've just updated your .env.local file, you MUST RESTART your Next.js development server for the changes to take effect.");
  console.error("Firebase initialization might fail due to the configuration issues listed above.");
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

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
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

export type { FirebaseUser };
