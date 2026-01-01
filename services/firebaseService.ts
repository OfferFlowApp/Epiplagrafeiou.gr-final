import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, Firestore } from "firebase/firestore";
import { Product } from "../types";

export const BUILD_VERSION = "2024.03.CLOUD_SYNC";

/**
 * Firebase Config - We use fallbacks to avoid app crashes if .env is missing.
 */
const getFirebaseConfig = () => {
  return {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyD4n446zq0JfmQacqRrv-Jze9Q_MAOJEkI",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "studio-3245048437-90a49.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "studio-3245048437-90a49",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "studio-3245048437-90a49.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "316817353424",
    appId: process.env.FIREBASE_APP_ID || "1:316817353424:web:011e0e6a5fb229c60"
  };
};

let dbInstance: Firestore | null = null;

export const initFirebase = (): Firestore | null => {
  if (dbInstance) return dbInstance;
  
  try {
    const config = getFirebaseConfig();
    // Safety check: if apiKey is missing or placeholder-like, we log but don't crash
    if (!config.apiKey || config.apiKey === "NOT_SET") {
        console.warn("Firebase: API Key is missing. Cloud features will be disabled.");
        return null;
    }

    const existingApps = getApps();
    const app = existingApps.length === 0 ? initializeApp(config) : getApp();
    
    dbInstance = getFirestore(app);
    console.log(`Eppla Cloud [${BUILD_VERSION}]: Attached to project ${config.projectId}`);
    return dbInstance;
  } catch (e) {
    console.warn("Firebase: Initialization failed. Operating in local mode.", e);
    return null;
  }
};

export const getEnvDebugInfo = () => {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID ? "DETECTED" : "FALLBACK",
    apiKey: process.env.FIREBASE_API_KEY ? "DETECTED" : "FALLBACK",
    stripeKey: process.env.STRIPE_PUBLIC_KEY ? "DETECTED" : "NOT SET",
    geminiKey: process.env.API_KEY ? "DETECTED" : "NOT SET"
  };
};

export const testCloudConnection = async (): Promise<{success: boolean, error?: string, code?: string}> => {
  const db = initFirebase();
  if (!db) return { success: false, error: "Cloud connection not configured. Set your FIREBASE_API_KEY in Vercel settings." };

  try {
    const testDoc = doc(db, "_system", "healthcheck");
    await setDoc(testDoc, { 
      lastCheck: new Date().toISOString(),
      status: "online",
      version: BUILD_VERSION,
      env: "production"
    });
    return { success: true };
  } catch (e: any) {
    console.error("Cloud Connection Failed:", e);
    if (e.code === 'permission-denied') {
      return { 
        success: false, 
        code: 'permission-denied',
        error: "Firestore Rules: Permission Denied. Check your Security Rules." 
      };
    }
    return { success: false, code: e.code, error: e.message };
  }
};

export const pushToCloud = async (products: Product[]) => {
  const db = initFirebase();
  if (!db) return false;
  try {
    const catalogDoc = doc(db, "eppla", "catalog");
    await setDoc(catalogDoc, { 
      products, 
      lastUpdated: new Date().toISOString(),
      source: "Web Admin Console"
    });
    return true;
  } catch (e) { return false; }
};

export const pullFromCloud = async (): Promise<Product[] | null> => {
  const db = initFirebase();
  if (!db) return null;
  try {
    const catalogDoc = doc(db, "eppla", "catalog");
    const snap = await getDoc(catalogDoc);
    return snap.exists() ? snap.data().products : null;
  } catch (e) { return null; }
};

export const isCloudConnected = () => !!dbInstance;