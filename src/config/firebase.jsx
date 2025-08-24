// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Add this

const firebaseConfig = {
  apiKey: "AIzaSyBeIaHMU5Ll5WItZ4DPGt1MplaLkyGFSwk",
  authDomain: "worldinfo-605c3.firebaseapp.com",
  projectId: "worldinfo-605c3",
  storageBucket: "worldinfo-605c3.firebasestorage.app",
  messagingSenderId: "1020275979789",
  appId: "1:1020275979789:web:758b14e6832ac5c3e0c744",
  measurementId: "G-TJ9QQ67648",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // Export auth
export default app;
