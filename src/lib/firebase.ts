// Firebase Client SDK Configuration
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDZkm8gi4V_1BMdxR-uegqARttu3QsY1BQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "agendaailajinha.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agendaailajinha",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "agendaailajinha.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "19208521391",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:19208521391:web:1eaafba03f1bda4266765a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-X8DBH900RJ",
};

// Initialize Firebase (only if not already initialized)
let app: ReturnType<typeof initializeApp>;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth only in browser
let auth: ReturnType<typeof getAuth> | null = null;
if (typeof window !== "undefined") {
  auth = getAuth(app);
}

// Initialize Analytics only in browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics, auth };

