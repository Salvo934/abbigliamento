import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const USERS_COLLECTION = "users";

/**
 * Salva il profilo utente su Firestore (users/{uid}).
 * @param {string} uid - ID utente Firebase Auth
 * @param {Object} profile - { nome, cognome, telefono, email }
 */
export async function saveUserProfile(uid, profile) {
  if (!db) {
    return Promise.reject(new Error("Firestore non disponibile."));
  }
  const now = new Date();
  const dataOra = now.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  await setDoc(doc(db, USERS_COLLECTION, uid), {
    nome: String(profile.nome ?? "").trim(),
    cognome: String(profile.cognome ?? "").trim(),
    telefono: String(profile.telefono ?? "").trim() || null,
    email: String(profile.email ?? "").trim(),
    createdAt: serverTimestamp(),
    registratoIl: dataOra,
  });
}
