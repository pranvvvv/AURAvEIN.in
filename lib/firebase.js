// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB6JjHYa9UIX8XHYPDTHeCsKpTU5fx2sA",
  authDomain: "auravein.firebaseapp.com",
  projectId: "auravein",
  storageBucket: "auravein.firebasestorage.app",
  messagingSenderId: "159867463429",
  appId: "1:159867463429:web:772287a9628d1bbb68f96c",
  measurementId: "G-DGYMVG4HTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app; 