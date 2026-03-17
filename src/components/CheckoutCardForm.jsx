import { forwardRef, useImperativeHandle, useRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#fafafa",
      fontFamily: "DM Sans, system-ui, sans-serif",
      "::placeholder": { color: "#a1a1a1" },
      iconColor: "#e6007e",
    },
    invalid: {
      color: "#ff6b6b",
      iconColor: "#ff6b6b",
    },
  },
};

/**
 * Form Stripe per inserimento dati carta. Espone confirmPayment(clientSecret) via ref.
 */
const CheckoutCardForm = forwardRef(function CheckoutCardForm(_, ref) {
  const stripe = useStripe();
  const elements = useElements();
  const submittingRef = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      async confirmPayment(clientSecret) {
        if (!stripe || !elements) throw new Error("Stripe non pronto.");
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("Inserisci i dati della carta.");
        if (submittingRef.current) throw new Error("Pagamento già in corso.");
        submittingRef.current = true;
        try {
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
          });
          if (error) throw new Error(error.message || "Pagamento rifiutato.");
          if (paymentIntent?.status !== "succeeded") throw new Error("Pagamento non completato.");
          return { paymentIntentId: paymentIntent.id };
        } finally {
          submittingRef.current = false;
        }
      },
    }),
    [stripe, elements]
  );

  return (
    <div className="checkout-card-form">
      <label className="checkout-card-form-label">Dati della carta</label>
      <div className="checkout-card-form-element">
        <CardElement options={CARD_OPTIONS} />
      </div>
      <p className="checkout-card-form-hint">I dati sono crittografati e non transitano dai nostri server.</p>
    </div>
  );
});

export default CheckoutCardForm;
