import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.trim() === "") return null;
  return new Stripe(key);
}

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
    const { orderId, amount, items, customer_email, success_url, cancel_url } = req.body || {};
    if (!orderId || amount == null || !items?.length || !success_url || !cancel_url) {
      return res.status(400).json({
        error: "Dati mancanti: orderId, amount, items, success_url, cancel_url.",
      });
    }

    const isValidUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));

    const line_items = items
      .filter((item) => {
        const price = Number(item.price);
        return Number.isFinite(price) && price > 0;
      })
      .map((item) => {
        const unitAmount = Math.round(Number(item.price) * 100);
        const productData = {
          name: String(item.name || "Prodotto").slice(0, 500),
          description: item.size ? `Taglia: ${item.size}${item.color ? `, Colore: ${item.color}` : ""}` : undefined,
        };
        if (item.image && isValidUrl(item.image)) {
          productData.images = [item.image];
        }
        return {
          price_data: {
            currency: "eur",
            product_data: productData,
            unit_amount: Math.max(50, unitAmount),
          },
          quantity: Math.max(1, Math.min(Number(item.quantity) || 1, 99)),
        };
      });

    if (line_items.length === 0) {
      return res.status(400).json({
        error: "Nessun prodotto con prezzo valido. Il prezzo deve essere maggiore di zero.",
      });
    }

    if (!isValidUrl(success_url) || !isValidUrl(cancel_url)) {
      return res.status(400).json({
        error: "URL di ritorno non validi. Riprova dal sito.",
      });
    }

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
    const message = err?.message || "Errore creazione sessione Stripe.";
    console.error("[Stripe] create-checkout-session:", message, err?.code || "");
    const userMessage =
      err?.code === "stripe_invalid_request_error"
        ? message
        : message.includes("No such")
          ? "Chiave Stripe non valida. Controlla STRIPE_SECRET_KEY in .env"
          : message;
    return res.status(500).json({ error: userMessage });
  }
}
