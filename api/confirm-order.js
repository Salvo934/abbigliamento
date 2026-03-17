import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.trim() === "") return null;
  return new Stripe(key);
}

/**
 * Verifica che il PaymentIntent sia stato pagato e restituisce l'orderId.
 * Il frontend aggiornerà l'ordine su Firestore dopo questa conferma.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(500).json({ error: "Stripe non configurato." });
  }

  try {
    const { paymentIntentId } = req.body || {};
    if (!paymentIntentId) {
      return res.status(400).json({ error: "paymentIntentId richiesto." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        error: "Pagamento non completato.",
        status: paymentIntent.status,
      });
    }

    const orderId = paymentIntent.metadata?.orderId || null;
    if (!orderId) {
      return res.status(400).json({ error: "Ordine non associato al pagamento." });
    }

    return res.status(200).json({ ok: true, orderId });
  } catch (err) {
    console.error("[Stripe] confirm-order:", err?.message);
    return res.status(500).json({ error: err?.message || "Errore verifica pagamento." });
  }
}
