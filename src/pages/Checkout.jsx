import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const STEPS = [
  { id: "spedizione", label: "Spedizione", icon: "📍" },
  { id: "pagamento", label: "Pagamento", icon: "💳" },
  { id: "conferma", label: "Conferma", icon: "✓" },
];

function generateOrderId() {
  return "ORD-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    citta: "",
    cap: "",
    note: "",
  });
  const [payment, setPayment] = useState("carta");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = "Inserisci il nome";
    if (!form.cognome.trim()) newErrors.cognome = "Inserisci il cognome";
    if (!form.email.trim()) newErrors.email = "Inserisci l'email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email non valida";
    if (!form.telefono.trim()) newErrors.telefono = "Inserisci il telefono";
    if (!form.indirizzo.trim()) newErrors.indirizzo = "Inserisci l'indirizzo";
    if (!form.citta.trim()) newErrors.citta = "Inserisci la città";
    if (!form.cap.trim()) newErrors.cap = "Inserisci il CAP";
    else if (!/^\d{5}$/.test(form.cap)) newErrors.cap = "CAP non valido (5 cifre)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1 && !validateStep1()) return;
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setOrderId(generateOrderId());
    clearCart();
  };

  if (cart.length === 0 && !orderId) {
    return (
      <div className="page checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">🛒</div>
          <h2>Il carrello è vuoto</h2>
          <p>Aggiungi dei prodotti prima di procedere al checkout.</p>
          <Link to="/shop" className="btn btn-primary">Vai allo Shop</Link>
        </div>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="page checkout-page">
        <div className="checkout-success">
          <div className="checkout-success-icon">✓</div>
          <h1>Ordine confermato!</h1>
          <p className="checkout-success-id">Numero ordine: <strong>{orderId}</strong></p>
          <p>Ti abbiamo inviato una conferma all'indirizzo <strong>{form.email}</strong>. La spedizione avverrà entro 3-5 giorni lavorativi.</p>
          <div className="checkout-success-actions">
            <button className="btn btn-primary" onClick={() => navigate("/shop")}>
              Continua lo shopping
            </button>
            <Link to="/" className="btn btn-secondary">Torna alla home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`checkout-step ${i + 1 === step ? "active" : ""} ${i + 1 < step ? "done" : ""}`}
            >
              <span className="checkout-step-num">{i + 1}</span>
              <span className="checkout-step-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <form className="checkout-form-wrapper" onSubmit={handleSubmit}>
        <div className="checkout-layout">
          <div className="checkout-main">
            {step === 1 && (
              <div className="checkout-block animate-in">
                <h2>Dati di spedizione</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nome">Nome *</label>
                    <input
                      id="nome"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      className={errors.nome ? "input-error" : ""}
                      placeholder="Mario"
                    />
                    {errors.nome && <span className="form-error">{errors.nome}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cognome">Cognome *</label>
                    <input
                      id="cognome"
                      name="cognome"
                      value={form.cognome}
                      onChange={handleChange}
                      className={errors.cognome ? "input-error" : ""}
                      placeholder="Rossi"
                    />
                    {errors.cognome && <span className="form-error">{errors.cognome}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                    placeholder="mario@email.it"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Telefono *</label>
                  <input
                    id="telefono"
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className={errors.telefono ? "input-error" : ""}
                    placeholder="+39 333 1234567"
                  />
                  {errors.telefono && <span className="form-error">{errors.telefono}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="indirizzo">Indirizzo *</label>
                  <input
                    id="indirizzo"
                    name="indirizzo"
                    value={form.indirizzo}
                    onChange={handleChange}
                    className={errors.indirizzo ? "input-error" : ""}
                    placeholder="Via Roma 1"
                  />
                  {errors.indirizzo && <span className="form-error">{errors.indirizzo}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="citta">Città *</label>
                    <input
                      id="citta"
                      name="citta"
                      value={form.citta}
                      onChange={handleChange}
                      className={errors.citta ? "input-error" : ""}
                      placeholder="Milano"
                    />
                    {errors.citta && <span className="form-error">{errors.citta}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cap">CAP *</label>
                    <input
                      id="cap"
                      name="cap"
                      value={form.cap}
                      onChange={handleChange}
                      className={errors.cap ? "input-error" : ""}
                      placeholder="20100"
                      maxLength={5}
                    />
                    {errors.cap && <span className="form-error">{errors.cap}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="note">Note (opzionale)</label>
                  <textarea
                    id="note"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Istruzioni per il corriere..."
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-block animate-in">
                <h2>Metodo di pagamento</h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="carta"
                      checked={payment === "carta"}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <span className="payment-option-label">Carta di credito / debito</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="paypal" checked={payment === "paypal"} onChange={(e) => setPayment(e.target.value)} />
                    <span className="payment-option-label">PayPal</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="bonifico" checked={payment === "bonifico"} onChange={(e) => setPayment(e.target.value)} />
                    <span className="payment-option-label">Bonifico bancario</span>
                  </label>
                </div>
                <p className="checkout-note">Il pagamento sarà elaborato in modo sicuro. Non memorizziamo i dati della carta.</p>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-block animate-in">
                <h2>Riepilogo ordine</h2>
                <div className="checkout-recap">
                  <div className="checkout-recap-address">
                    <strong>Spedizione a</strong>
                    <p>{form.nome} {form.cognome}<br />
                    {form.indirizzo}<br />
                    {form.cap} {form.citta}</p>
                    <p>{form.email} · {form.telefono}</p>
                  </div>
                  <div className="checkout-recap-payment">
                    <strong>Pagamento</strong>
                    <p>{payment === "carta" ? "Carta di credito/debito" : payment === "paypal" ? "PayPal" : "Bonifico bancario"}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="checkout-actions">
              {step > 1 ? (
                <button type="button" className="btn btn-secondary" onClick={handleBack}>
                  Indietro
                </button>
              ) : (
                <Link to="/carrello" className="btn btn-secondary">Modifica carrello</Link>
              )}
              {step < 3 ? (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Continua
                </button>
              ) : (
                <button type="submit" className="btn btn-primary btn-confirm">
                  Completa ordine — € {cartTotal.toFixed(2)}
                </button>
              )}
            </div>
          </div>

          <aside className="checkout-summary">
            <h3>Il tuo ordine</h3>
            <ul className="checkout-summary-list">
              {cart.map((item) => (
                <li key={`${item.id}-${item.size}`}>
                  <span className="checkout-summary-name">{item.name} <em>({item.size})</em> × {item.quantity}</span>
                  <span className="checkout-summary-price">€ {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="checkout-summary-total">
              <span>Totale</span>
              <strong>€ {cartTotal.toFixed(2)}</strong>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
