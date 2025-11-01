import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Safe initialization with error handling
let app;
let auth;
let db;

if (typeof window !== 'undefined') {
  try {
    // Check if all required config values are present
    const isConfigValid = 
      firebaseConfig.apiKey && 
      firebaseConfig.authDomain && 
      firebaseConfig.projectId;
    
    if (isConfigValid) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log('Firebase initialized successfully');
    } else {
      console.warn('Firebase config is incomplete');
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
}

export { auth, db };
export default app;