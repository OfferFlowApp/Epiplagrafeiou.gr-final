import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, Firestore } from "firebase/firestore";
import { Product } from "../types";

// Standard Web Configuration (Publicly safe for frontend apps)
const STUDIO_CONFIG = {
  apiKey: "AIzaSyD4n446zq0JfmQacqRrv-Jze9Q_MAOJEkI",
  authDomain: "studio-3245048437-90a49.firebaseapp.com",
  projectId: "studio-3245048437-90a49",
  storageBucket: "studio-3245048437-90a49.firebasestorage.app",
  messagingSenderId: "316817353424",
  appId: "1:316817353424:web:011e0e6a5fb229c60"
};

let dbInstance: Firestore | null = null;
let initAttempted = false;

export const initFirebase = (): Firestore | null => {
  if (dbInstance) return dbInstance;
  initAttempted = true;
  
  try {
    const app = getApps().length === 0 ? initializeApp(STUDIO_CONFIG) : getApp();
    dbInstance = getFirestore(app);
    console.log("Eppla: Firebase initialized for project", STUDIO_CONFIG.projectId);
    return dbInstance;
  } catch (e) {
    console.error("Firebase initialization failed:", e);
    return null;
  }
};

export const testCloudConnection = async (): Promise<{success: boolean, error?: string, code?: string}> => {
  const db = initFirebase();
  if (!db) return { success: false, error: "SDK failed to initialize. Check your Internet or Firewall." };

  try {
    // Attempting a write to a system collection
    const testDoc = doc(db, "_system", "healthcheck");
    await setDoc(testDoc, { 
      lastCheck: new Date().toISOString(),
      status: "online",
      client: "Eppla Web"
    });
    return { success: true };
  } catch (e: any) {
    console.error("Connection Test Error:", e);
    
    // Friendly error messages for common Cloud issues
    if (e.code === 'permission-denied') {
      return { 
        success: false, 
        code: 'permission-denied',
        error: "Database Locked: You need to enable 'Test Mode' in your Firebase Firestore Rules tab." 
      };
    }
    
    return { 
      success: false, 
      code: e.code,
      error: e.message || "Unknown error connecting to Google Cloud." 
    };
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
      count: products.length 
    });
    return true;
  } catch (e) {
    console.error("Cloud push error:", e);
    return false;
  }
};

export const pullFromCloud = async (): Promise<Product[] | null> => {
  const db = initFirebase();
  if (!db) return null;
  
  try {
    const catalogDoc = doc(db, "eppla", "catalog");
    const snap = await getDoc(catalogDoc);
    if (snap.exists()) {
      return snap.data().products as Product[];
    }
    return null;
  } catch (e) {
    console.error("Cloud pull error:", e);
    return null;
  }
};

export const isCloudConnected = () => !!dbInstance;
export const hasAttemptedInit = () => initAttempted;
