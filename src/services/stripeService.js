/**
 * Crea una sessione Stripe Checkout (redirect alla pagina di pagamento).
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
      "API non raggiungibile. In locale avvia con: npm run dev (sito + API)."
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (typeof data?.error === "string" && data.error.trim()) ||
      (res.status === 404
        ? "API non disponibile. In locale usa: npm run dev"
        : res.status === 503
          ? "Servizio pagamenti non disponibile. Controlla che il server sia avviato con npm run dev."
          : `Errore creazione pagamento${res.status ? ` (${res.status})` : ""}. Riprova o scegli un altro metodo di pagamento.`);
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
  const res = await fetch(
    `/api/get-session?session_id=${encodeURIComponent(sessionId)}`
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Sessione non valida.");
  return data;
}

/**
 * Crea un PaymentIntent per pagamento con carta sulla pagina (form integrato).
 * @param {{ orderId: string, amount: number }} payload
 * @returns {Promise<{ clientSecret: string }>}
 */
export async function createPaymentIntent(payload) {
  const res = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Errore preparazione pagamento.");
  if (!data.clientSecret) throw new Error("Dati pagamento non ricevuti.");
  return data;
}

/**
 * Verifica che il pagamento sia andato a buon fine (dopo confirmCardPayment).
 * @param {{ paymentIntentId: string }} payload
 * @returns {Promise<{ ok: boolean, orderId: string }>}
 */
export async function confirmOrder(payload) {
  const res = await fetch("/api/confirm-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Errore verifica pagamento.");
  return data;
}
