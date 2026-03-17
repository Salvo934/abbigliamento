/**
 * Server API locale per sviluppo: espone /api/create-checkout-session e /api/get-session
 * così i pagamenti Stripe funzionano con solo "npm run dev".
 * In produzione si usano le stesse route su Vercel.
 * Gli handler vengono caricati in modo asincrono così il server parte anche se Stripe non è configurato.
 */
import "dotenv/config";
import express from "express";
import { createServer } from "http";

const PORT = Number(process.env.API_PORT) || 3001;
const app = express();
app.use(express.json());

function adapter(expressReq, expressRes, handler) {
  const req = {
    method: expressReq.method,
    body: expressReq.body,
    query: expressReq.query,
  };
  const res = {
    _status: 200,
    setHeader() {},
    status(code) {
      this._status = code;
      return this;
    },
    json(data) {
      expressRes.status(this._status).json(data);
      return this;
    },
    end() {
      expressRes.end();
    },
  };
  handler(req, res).catch((err) => {
    console.error("[local-api]", err);
    expressRes.status(500).json({ error: err?.message || "Errore server." });
  });
}

let createCheckoutHandler = null;
let getSessionHandler = null;
let createPaymentIntentHandler = null;
let confirmOrderHandler = null;

async function loadHandlers() {
  try {
    const [createMod, getMod, paymentIntentMod, confirmMod] = await Promise.all([
      import("../api/create-checkout-session.js"),
      import("../api/get-session.js"),
      import("../api/create-payment-intent.js"),
      import("../api/confirm-order.js"),
    ]);
    createCheckoutHandler = createMod.default;
    getSessionHandler = getMod.default;
    createPaymentIntentHandler = paymentIntentMod.default;
    confirmOrderHandler = confirmMod.default;
  } catch (err) {
    console.warn("[local-api] Handler Stripe non caricati:", err?.message);
  }
}

app.post("/api/create-checkout-session", (req, res) => {
  if (!createCheckoutHandler) {
    return res.status(503).json({ error: "API pagamenti non disponibile. Configura STRIPE_SECRET_KEY in .env" });
  }
  adapter(req, res, createCheckoutHandler);
});
app.get("/api/get-session", (req, res) => {
  if (!getSessionHandler) {
    return res.status(503).json({ error: "API pagamenti non disponibile." });
  }
  adapter(req, res, getSessionHandler);
});
app.post("/api/create-payment-intent", (req, res) => {
  if (!createPaymentIntentHandler) {
    return res.status(503).json({ error: "API pagamenti non disponibile." });
  }
  adapter(req, res, createPaymentIntentHandler);
});
app.post("/api/confirm-order", (req, res) => {
  if (!confirmOrderHandler) {
    return res.status(503).json({ error: "API pagamenti non disponibile." });
  }
  adapter(req, res, confirmOrderHandler);
});

loadHandlers(); // carica in background; il sito resta raggiungibile anche se Stripe non è configurato

const server = createServer(app);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`[API locale] http://localhost:${PORT}/api`);
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[API locale] Porta ${PORT} occupata. Chiudi l'altro processo o esegui: npm run dev`);
    process.exit(1);
  }
  throw err;
});
