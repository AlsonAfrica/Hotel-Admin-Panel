// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOeCOHpMhgFLJNX5U7GVlyJBV5ppwrCNA",
  authDomain: "hotel-app-directory.firebaseapp.com",
  projectId: "hotel-app-directory",
  storageBucket: "hotel-app-directory.appspot.com",
  messagingSenderId: "173515103644",
  appId: "1:173515103644:web:3e15cc6a3c85c0d507fc59",
  measurementId: "G-2P5907RW6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 

export default app;