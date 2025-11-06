// Firebase Configuration - CLIENT-SIDE ONLY
// Este arquivo é apenas para uso no cliente (browser)

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase Client
let app: FirebaseApp;
if (typeof window !== "undefined" && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else if (getApps().length > 0) {
  app = getApps()[0];
} else {
  // Server-side: não inicializar client SDK
  app = {} as FirebaseApp;
}

export const auth: Auth = typeof window !== "undefined" ? getAuth(app) : ({} as Auth);
export const db: Firestore = typeof window !== "undefined" ? getFirestore(app) : ({} as Firestore);
export const storage: FirebaseStorage = typeof window !== "undefined" ? getStorage(app) : ({} as FirebaseStorage);

// Firebase Admin SDK is in a separate file (firebase-admin.ts)
// to avoid bundling it in the client-side code
