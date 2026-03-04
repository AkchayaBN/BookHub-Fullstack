// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdvnFv2cMh-DqQHTXPHWRozOgnGAbiOtE",
  authDomain: "bookhub-4d200.firebaseapp.com",
  projectId: "bookhub-4d200",
  storageBucket: "bookhub-4d200.firebasestorage.app",
  messagingSenderId: "923139479996",
  appId: "1:923139479996:web:8b8e711db6dd2f3e4f33b9",
  measurementId: "G-Q1CL6ESCYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);