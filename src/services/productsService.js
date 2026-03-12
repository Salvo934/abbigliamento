import { collection, getDocsFromServer } from "firebase/firestore";
import { db } from "../firebase/config";
import { products as localProducts, categories as localCategories } from "../data/products";

const PRODUCTS_COLLECTION = "products";
const CATEGORIES_COLLECTION = "categories";

/**
 * Legge i prodotti da Firestore (sempre dal server, per evitare problemi cache su desktop).
 * Se Firestore non è disponibile o la collection è vuota, usa i dati locali.
 */
export async function getProducts() {
  if (!db) {
    return localProducts.map((p) => ({ ...p, id: String(p.id) }));
  }
  try {
    const snapshot = await getDocsFromServer(collection(db, PRODUCTS_COLLECTION));
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => {
        const d = doc.data();
        return { id: doc.id, ...d, price: Number(d.price) || 0 };
      });
    }
  } catch (e) {
    console.warn("Firestore products non disponibili, uso dati locali:", e?.message);
  }
  return localProducts.map((p) => ({ ...p, id: String(p.id) }));
}

/**
 * Legge le categorie da Firestore (sempre dal server).
 * Se Firestore non è disponibile o non presenti, usa le locali.
 */
export async function getCategories() {
  if (!db) {
    return localCategories;
  }
  try {
    const snapshot = await getDocsFromServer(collection(db, CATEGORIES_COLLECTION));
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {
    console.warn("Firestore categories non disponibili, uso dati locali:", e?.message);
  }
  return localCategories;
}

/**
 * Prodotto per id (da array già caricato o da dati locali).
 */
export function getProductByIdFromList(productsList, id) {
  const numId = Number(id);
  const found = productsList.find((p) => p.id === id || p.id === numId);
  if (found) return found;
  return localProducts.find((p) => p.id === numId) ?? null;
}
