
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
// Only import getAuth if you plan to use other Firebase services that might need it.
// For Supabase auth, it's not directly needed here anymore.
// import { getAuth } from 'firebase/auth';

// IMPORTANT:
// For Firebase Authentication to work (if you were using it):
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
const placeholderValues = [
  "YOUR_FIREBASE_API_KEY",
  "YOUR_FIREBASE_AUTH_DOMAIN",
  "YOUR_FIREBASE_PROJECT_ID",
  // Add other placeholders if necessary
];

if (!firebaseConfig.apiKey || placeholderValues.includes(firebaseConfig.apiKey)) {
  console.error(
    `Firebase Config Error: NEXT_PUBLIC_FIREBASE_API_KEY is ${!firebaseConfig.apiKey ? "missing or empty" : "still set to a placeholder value"}. Please set it in your .env.local file and restart your server.`
  );
  configError = true;
}
if (!firebaseConfig.authDomain || placeholderValues.includes(firebaseConfig.authDomain)) {
  console.error(
    `Firebase Config Error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is ${!firebaseConfig.authDomain ? "missing or empty" : "still set to a placeholder value"}. Please set it in your .env.local file and restart your server.`
  );
  configError = true;
}
if (!firebaseConfig.projectId || placeholderValues.includes(firebaseConfig.projectId)) {
  console.error(
    `Firebase Config Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is ${!firebaseConfig.projectId ? "missing or empty" : "still set to a placeholder value"}. Please set it in your .env.local file and restart your server.`
  );
  configError = true;
}

if (configError) {
  console.error("---");
  console.error(
    "CRITICAL: Firebase initialization might fail due to configuration issues. Ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set."
  );
  console.error(
    "Also, for Firebase Auth (if used): check Firebase console - Email/Password sign-in must be enabled, and your app domain(s) must be in 'Authorized domains'."
  );
  console.error("---");
}

// Initialize Firebase
let app: FirebaseApp | null = null; // Allow app to be null if config is bad
if (!configError && firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} else {
  console.warn("Firebase app was not initialized due to configuration errors. Some Firebase services may not be available.");
}

// export const auth = app ? getAuth(app) : null; // Export auth only if app is initialized. 
// If you are fully moving to Supabase for auth, you might not need to export Firebase auth at all.

// If you are NOT using any Firebase services other than Auth (which is now handled by Supabase),
// you can significantly simplify or even remove this file, or parts of it related to Firebase Auth.
// For now, it's left in case other Firebase services like Firestore or Storage are planned.

// No Firebase auth functions are exported here as Supabase is handling auth.
// export type { FirebaseUser } from 'firebase/auth'; // Keep if other parts of your app expect this type.
