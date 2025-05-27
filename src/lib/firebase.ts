
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser, signInWithEmailAndPassword } from 'firebase/auth';

// IMPORTANT:
// For Firebase Authentication to work, especially with Google Sign-In:
// 1. Ensure your .env.local file has the CORRECT Firebase project credentials.
// 2. In your Firebase Console (https://console.firebase.google.com/):
//    a. Go to Authentication -> Sign-in method.
//    b. Ensure the "Google" provider is ENABLED (if you plan to use it).
//    c. Ensure "Email/Password" provider is ENABLED.
//    d. Add your application's domain(s) to the "Authorized domains" list.
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

// Define more explicit placeholder values to check against
const placeholderValues = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE", // More explicit placeholder
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN_HERE", // More explicit placeholder
  projectId: "YOUR_ACTUAL_PROJECT_ID_HERE", // More explicit placeholder
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET_HERE", // Optional for auth only
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID_HERE", // Optional for auth only
  appId: "YOUR_ACTUAL_APP_ID_HERE" // Optional for auth only
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
  console.error("Also, ensure Email/Password sign-in (and Google Sign-In, if used) is enabled and your app domain (e.g., localhost, your-deployment-domain.com) is an 'Authorized domain' in your Firebase project's Authentication settings page in the Firebase Console.");
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
export const googleProvider = new GoogleAuthProvider(); // Keep for potential future use or if other parts use it

// signInWithEmailAndPassword is directly imported and used from 'firebase/auth' in login page.
// No need for a separate wrapper here unless adding more logic.

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
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
