import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";

let app = null;
let auth = null;
let db = null;
let analytics = null;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;
  if (!hasConfig) {
    if (typeof window !== "undefined") {
      console.warn(
        "[Firebase] Variabili mancanti (.env). Uso dati locali. Aggiungi localhost in Authentication → Authorized domains per desktop."
      );
    }
    throw new Error("Firebase config mancante");
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  try {
    db = initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch (e) {
    if (typeof window !== "undefined") {
      console.warn("[Firebase] Firestore init fallback:", e?.message);
    }
    db = getFirestore(app);
  }

  if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    try {
      analytics = getAnalytics(app);
    } catch (_) {
      analytics = null;
    }
  }
} catch (e) {
  if (typeof window !== "undefined") {
    console.warn("[Firebase] Inizializzazione fallita, l'app userà solo dati locali:", e?.message);
  }
}

export { auth, db };
export default app;
export { analytics };
