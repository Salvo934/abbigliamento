import { createContext, useContext, useEffect, useState, useRef } from "react";
import { saveUserProfile } from "../services/usersService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const firebaseRef = useRef(null);

  useEffect(() => {
    let unsubscribe = () => {};
    Promise.all([
      import("firebase/auth"),
      import("../firebase/config"),
    ])
      .then(([authMod, configMod]) => {
        const auth = configMod.auth;
        firebaseRef.current = { auth, authMod };
        if (!auth) {
          setLoading(false);
          return;
        }
        try {
          unsubscribe = authMod.onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
          });
        } catch (e) {
          console.error("[Auth] Errore onAuthStateChanged:", e);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.warn("[Auth] Firebase non caricato:", e?.message);
        setLoading(false);
      });
    return () => {
      try {
        unsubscribe();
      } catch (_) {}
    };
  }, []);

  const login = (email, password) => {
    const { auth, authMod } = firebaseRef.current || {};
    return auth && authMod
      ? authMod.signInWithEmailAndPassword(auth, email, password)
      : Promise.reject(new Error("Auth non disponibile."));
  };
  const register = async (email, password, profile = {}) => {
    const { auth, authMod } = firebaseRef.current || {};
    if (!auth || !authMod) return Promise.reject(new Error("Auth non disponibile."));
    const userCredential = await authMod.createUserWithEmailAndPassword(auth, email, password);
    try {
      await saveUserProfile(userCredential.user.uid, { ...profile, email: profile.email || email });
    } catch (e) {
      console.warn("Profilo non salvato su Firestore:", e?.message);
    }
  };
  const signOut = () => {
    const { auth, authMod } = firebaseRef.current || {};
    return auth && authMod ? authMod.signOut(auth) : Promise.resolve();
  };
  const resetPassword = (email) => {
    const { auth, authMod } = firebaseRef.current || {};
    return auth && authMod
      ? authMod.sendPasswordResetEmail(auth, email)
      : Promise.reject(new Error("Auth non disponibile."));
  };

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
