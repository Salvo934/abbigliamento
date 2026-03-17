import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.trim() === "") return null;
  return new Stripe(key);
}

/**
 * Crea un PaymentIntent per pagamento con carta sulla pagina (Stripe Elements).
 * Il frontend userà il client_secret per confirmCardPayment.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(500).json({ error: "Stripe non configurato (STRIPE_SECRET_KEY mancante)." });
  }

  try {
    const { orderId, amount } = req.body || {};
    if (!orderId || amount == null || amount <= 0) {
      return res.status(400).json({
        error: "Dati mancanti o non validi: orderId e amount (maggiore di zero) richiesti.",
      });
    }

    const amountInCents = Math.round(Number(amount) * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.max(50, amountInCents),
      currency: "eur",
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err?.message || "Errore creazione pagamento.";
    console.error("[Stripe] create-payment-intent:", message);
    return res.status(500).json({ error: message });
  }
}
