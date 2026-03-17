import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe non configurato (STRIPE_SECRET_KEY mancante)." });
  }

  try {
    const { orderId, amount, items, customer_email, success_url, cancel_url } = req.body || {};
    if (!orderId || amount == null || !items?.length || !success_url || !cancel_url) {
      return res.status(400).json({
        error: "Dati mancanti: orderId, amount, items, success_url, cancel_url.",
      });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.size ? `Taglia: ${item.size}${item.color ? `, Colore: ${item.color}` : ""}` : undefined,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: customer_email || undefined,
      success_url,
      cancel_url,
      metadata: { orderId },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[Stripe] create-checkout-session:", err?.message);
    return res.status(500).json({ error: err?.message || "Errore creazione sessione Stripe." });
  }
}
