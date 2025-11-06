// Firebase Configuration - SIMPLIFICADO
// Tudo do Firebase em um único arquivo

// ============================================
// CLIENT-SIDE (Browser)
// ============================================
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

// ============================================
// SERVER-SIDE (Admin SDK)
// ============================================
import { initializeApp as initAdmin, getApps as getAdminApps, cert, App } from "firebase-admin/app";
import { getAuth as getAdminAuth, Auth as AdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from "firebase-admin/firestore";
import { getStorage as getAdminStorage, Storage as AdminStorage } from "firebase-admin/storage";

// Initialize Firebase Admin
let adminApp: App | null = null;
let adminAuth: AdminAuth | null = null;
let adminDb: AdminFirestore | null = null;
let adminStorage: AdminStorage | null = null;

if (getAdminApps().length === 0) {
  try {
    let serviceAccount: any = null;

    // Try to parse from environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const cleanJson = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
        serviceAccount = cleanJson.startsWith("{") 
          ? JSON.parse(cleanJson) 
          : JSON.parse(JSON.parse(`"${cleanJson}"`));
      } catch (error) {
        console.error("Erro ao fazer parse do FIREBASE_SERVICE_ACCOUNT:", error);
      }
    }

    // Try to load from file (development)
    if (!serviceAccount) {
      try {
        const fs = require("fs");
        const path = require("path");
        const credPath = path.join(process.cwd(), "firebase-service-account.json");
        if (fs.existsSync(credPath)) {
          serviceAccount = JSON.parse(fs.readFileSync(credPath, "utf-8"));
        }
      } catch (error) {
        // File doesn't exist, that's ok
      }
    }

    // Initialize if we have valid credentials
    if (serviceAccount?.private_key) {
      adminApp = initAdmin({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || serviceAccount.project_id,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
      });
      adminAuth = getAdminAuth(adminApp);
      adminDb = getAdminFirestore(adminApp);
      adminStorage = getAdminStorage(adminApp);
    }
  } catch (error) {
    console.error("Erro ao inicializar Firebase Admin:", error);
  }
} else {
  adminApp = getAdminApps()[0];
  adminAuth = getAdminAuth(adminApp);
  adminDb = getAdminFirestore(adminApp);
  adminStorage = getAdminStorage(adminApp);
}

export { adminAuth, adminDb, adminStorage };

// Export bucket for backward compatibility
export const adminBucket = adminStorage?.bucket() || null;

// ============================================
// HELPER FUNCTIONS
// ============================================

// Verify Firebase ID token (server-side)
export async function verifyIdToken(token: string) {
  if (!adminAuth) {
    throw new Error("Firebase Admin não inicializado");
  }
  return await adminAuth.verifyIdToken(token);
}

// Get user from Firestore
export async function getUserFromFirestore(userId: string) {
  if (!adminDb) return null;
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    return userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

// Create or update user in Firestore
export async function createOrUpdateUser(userId: string, userData: any) {
  if (!adminDb) return false;
  try {
    const userRef = adminDb.collection("users").doc(userId);
    const existing = await userRef.get();
    
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (!existing.exists) {
      updateData.status = true;
      updateData.createdAt = userData.createdAt || new Date();
      updateData.email = userData.email || null;
      updateData.emailVerified = userData.emailVerified || false;
    } else {
      const current = existing.data();
      if (!current?.email && userData.email) {
        updateData.email = userData.email;
      }
    }

    await userRef.set(updateData, { merge: true });
    return true;
  } catch (error) {
    console.error("Erro ao criar/atualizar usuário:", error);
    return false;
  }
}
