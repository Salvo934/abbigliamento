import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { saveUserProfile } from "../services/usersService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, (u) => {
        try {
          setUser(u);
          setLoading(false);
        } catch (e) {
          console.error("[Auth] Errore callback:", e);
          setLoading(false);
        }
      });
    } catch (e) {
      console.error("[Auth] Errore onAuthStateChanged:", e);
      setLoading(false);
    }
    return () => {
      try {
        unsubscribe();
      } catch (_) {}
    };
  }, []);

  const login = (email, password) =>
    auth ? signInWithEmailAndPassword(auth, email, password) : Promise.reject(new Error("Auth non disponibile per questo dominio."));
  const register = async (email, password, profile = {}) => {
    if (!auth) return Promise.reject(new Error("Auth non disponibile per questo dominio."));
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await saveUserProfile(userCredential.user.uid, { ...profile, email: profile.email || email });
    } catch (e) {
      console.warn("Profilo non salvato su Firestore:", e?.message);
    }
  };
  const signOut = () => (auth ? firebaseSignOut(auth) : Promise.resolve());
  const resetPassword = (email) =>
    auth ? sendPasswordResetEmail(auth, email) : Promise.reject(new Error("Auth non disponibile per questo dominio."));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        signOut,
        resetPassword,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
