import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const ORDERS_COLLECTION = "orders";

/**
 * Salva un ordine su Firestore.
 * @param {Object} order - { items, total, shipping, paymentMethod, userId?, userEmail?, status? }
 * @param {string} [order.status] - 'pending' (pagamento in attesa), 'completed' (pagato)
 * @returns {Promise<string>} ID ordine
 */
export async function saveOrder(order) {
  if (!db) {
    return Promise.reject(new Error("Firestore non disponibile. Ordine non salvato."));
  }
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Aggiorna lo stato di un ordine (es. dopo pagamento con carta).
 */
export async function updateOrderStatus(orderId, updates) {
  if (!db) return Promise.reject(new Error("Firestore non disponibile."));
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Ordini dell'utente (ordinati per data in memoria).
 */
export async function getOrdersByUserId(userId) {
  if (!db) return [];
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  orders.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
  return orders;
}
