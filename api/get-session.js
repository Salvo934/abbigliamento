import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.trim() === "") return null;
  return new Stripe(key);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(500).json({ error: "Stripe non configurato." });
  }

  const session_id = req.query.session_id;
  if (!session_id) {
    return res.status(400).json({ error: "session_id richiesto." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === "paid";
    const orderId = session.metadata?.orderId || null;
    return res.status(200).json({
      paid,
      orderId,
      customer_email: session.customer_email || session.customer_details?.email,
    });
  } catch (err) {
    console.error("[Stripe] get-session:", err?.message);
    return res.status(500).json({ error: err?.message || "Sessione non valida." });
  }
}
