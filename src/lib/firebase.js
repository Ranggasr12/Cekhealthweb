import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB8BLLX3iMUliBy4hERrpjOOHmhpI74-kw",
  authDomain: "cekhealthweb.firebaseapp.com",
  projectId: "cekhealthweb",
  storageBucket: "cekhealthweb.firebasestorage.app",
  messagingSenderId: "7735001999",
  appId: "1:7735001999:web:d335c2ddd3dc298bbc41fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;