import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCheckoutSession } from "../services/stripeService";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [state, setState] = useState({ status: "loading", orderId: null, error: null });

  useEffect(() => {
    if (!sessionId) {
      setState({ status: "error", orderId: null, error: "Sessione non trovata." });
      return;
    }
    getCheckoutSession(sessionId)
      .then((data) => {
        if (data.paid && data.orderId) {
          clearCart();
          setState({ status: "success", orderId: data.orderId });
        } else {
          setState({ status: "error", orderId: null, error: "Pagamento non completato." });
        }
      })
      .catch((err) => {
        setState({ status: "error", orderId: null, error: err?.message || "Verifica pagamento fallita." });
      });
  }, [sessionId, clearCart]);

  if (state.status === "loading") {
    return (
      <div className="page checkout-page">
        <div className="checkout-success">
          <p>Verifica del pagamento in corso...</p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="page checkout-page">
        <div className="checkout-empty">
          <h2>Qualcosa non è andato a buon fine</h2>
          <p>{state.error}</p>
          <Link to="/checkout" className="btn btn-primary">Torna al checkout</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="checkout-success">
        <div className="checkout-success-icon">✓</div>
        <h1>Pagamento completato!</h1>
        <p className="checkout-success-id">Numero ordine: <strong>ORD-{state.orderId}</strong></p>
        <p>La spedizione avverrà entro 3-5 giorni lavorativi.</p>
        <div className="checkout-success-actions">
          <Link to="/shop" className="btn btn-primary">Continua lo shopping</Link>
          <Link to="/" className="btn btn-secondary">Torna alla home</Link>
        </div>
      </div>
    </div>
  );
}
