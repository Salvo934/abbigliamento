/**
 * Chiama l'API Vercel per creare una Stripe Checkout Session.
 * @param {{ orderId: string, amount: number, items: Array<{ name: string, price: number, quantity: number, size?: string, color?: string, image?: string }>, customer_email: string, success_url: string, cancel_url: string }} payload
 * @returns {Promise<{ url: string }>}
 */
export async function createCheckoutSession(payload) {
  let res;
  try {
    res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new Error(
      "API non raggiungibile. In locale avvia con: vercel dev (non npm run dev)."
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || (res.status === 404
      ? "API non disponibile. In locale usa: vercel dev"
      : "Errore creazione pagamento.");
    throw new Error(msg);
  }
  if (!data.url) throw new Error("URL di pagamento non ricevuto.");
  return data;
}

/**
 * Verifica lo stato della sessione Stripe (dopo redirect da Checkout).
 * @param {string} sessionId
 * @returns {Promise<{ paid: boolean, orderId: string | null, customer_email?: string }>}
 */
export async function getCheckoutSession(sessionId) {
  const res = await fetch(`/api/get-session?session_id=${encodeURIComponent(sessionId)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Sessione non valida.");
  return data;
}
