
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

// IMPORTANT:
// For Firebase Authentication to work, especially with Google Sign-In:
// 1. Ensure your .env.local file has the CORRECT Firebase project credentials.
// 2. In your Firebase Console (https://console.firebase.google.com/):
//    a. Go to Authentication -> Sign-in method.
//    b. Ensure the "Google" provider is ENABLED.
//    c. Add your application's domain(s) to the "Authorized domains" list.
//       This typically includes 'localhost' for local development and any
//       deployment domains (e.g., your-project.cloudworkstations.dev).
//    The error 'auth/configuration-not-found' often points to issues here.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const placeholderValues = {
  apiKey: "API_KEY_FROM_FIREBASE_CONSOLE",
  authDomain: "AUTH_DOMAIN_FROM_FIREBASE_CONSOLE",
  projectId: "PROJECT_ID_FROM_FIREBASE_CONSOLE",
  storageBucket: "STORAGE_BUCKET_FROM_FIREBASE_CONSOLE", // Optional for auth only
  messagingSenderId: "MESSAGING_SENDER_ID_FROM_FIREBASE_CONSOLE", // Optional for auth only
  appId: "APP_ID_FROM_FIREBASE_CONSOLE" // Optional for auth only
};

let configError = false;

if (firebaseConfig.apiKey === placeholderValues.apiKey || !firebaseConfig.apiKey) {
  console.error(`Firebase Config Error: NEXT_PUBLIC_FIREBASE_API_KEY is still set to the placeholder '${placeholderValues.apiKey}' or is missing. Please update it in your .env.local file with your actual Firebase API Key and restart your development server.`);
  configError = true;
}
if (firebaseConfig.authDomain === placeholderValues.authDomain || !firebaseConfig.authDomain) {
  console.error(`Firebase Config Error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is still set to the placeholder '${placeholderValues.authDomain}' or is missing. Please update it in your .env.local file and restart your server.`);
  configError = true;
}
if (firebaseConfig.projectId === placeholderValues.projectId || !firebaseConfig.projectId) {
  console.error(`Firebase Config Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is still set to the placeholder '${placeholderValues.projectId}' or is missing. Please update it in your .env.local file and restart your server.`);
  configError = true;
}

if (configError) {
  console.error("---");
  console.error("IMPORTANT: If you've just updated your .env.local file, you MUST RESTART your Next.js development server for the changes to take effect.");
  console.error("Firebase initialization might fail due to the configuration issues listed above. Also, ensure Google Sign-In is enabled and your app domain is an 'Authorized domain' in your Firebase project's Authentication settings.");
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
    // Log more details if it's a configuration error
    if ((error as any).code === 'auth/configuration-not-found') {
        console.error("Detailed Firebase auth/configuration-not-found: This usually means Google Sign-In is not enabled in your Firebase project's Authentication settings, or your app's domain (e.g., localhost, your-deployment-domain.com) is not added to the 'Authorized domains' list there.");
    }
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
