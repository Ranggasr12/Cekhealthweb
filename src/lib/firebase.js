// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Gunakan environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth dengan error handling
let auth;
try {
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
} catch (error) {
  console.error('❌ Firebase Auth initialization failed:', error);
  // Fallback: create a mock auth object to prevent crashes
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      console.warn('⚠️ Using mock auth - no real authentication');
      callback(null);
      return () => {}; // Return empty unsubscribe function
    },
    signOut: async () => {
      console.warn('⚠️ Mock auth signOut called');
    }
  };
}

// Initialize Firestore dengan error handling
let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  
  // Enable offline persistence
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('✅ Offline persistence enabled');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ The current browser doesn\'t support persistence.');
      } else {
        console.warn('⚠️ Offline persistence error:', err);
      }
    });
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  // Fallback: create a mock db object
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => {}
      })
    })
  };
}

export { auth, db };
export default app;