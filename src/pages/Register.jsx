import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, authAvailable } = useAuth();
  const { showToast } = useToast();
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formatTelefono = (digits) => {
    if (!digits.length) return "";
    const withPrefix = digits.startsWith("39") ? digits : "39" + digits;
    const rest = withPrefix.slice(0, 12).slice(2);
    const spaced = rest.replace(/(\d{3})(?=\d)/g, "$1 ");
    return "+39 " + spaced;
  };

  const handleTelefonoChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    setTelefono(formatTelefono(raw));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Le password non coincidono");
      return;
    }
    if (password.length < 6) {
      showToast("La password deve avere almeno 6 caratteri");
      return;
    }
    const digitsOnly = telefono.replace(/\D/g, "");
    if (digitsOnly.length > 0 && digitsOnly.length < 9) {
      showToast("Inserisci un numero di telefono valido (almeno 9 cifre)");
      return;
    }
    setLoading(true);
    try {
      const telefonoToSave = telefono.trim() || null;
      await register(email, password, { nome, cognome, telefono: telefonoToSave, email });
      showToast("Account creato. Benvenuto!");
      navigate("/");
    } catch (err) {
      const msg = err.code === "auth/email-already-in-use"
        ? "Questa email è già registrata"
        : err.code === "auth/invalid-email"
          ? "Email non valida"
          : err.message || "Errore durante la registrazione";
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-auth page-register">
      <div className="auth-bg" aria-hidden />
      <div className="auth-wrapper">
        <button
          type="button"
          className="auth-close"
          onClick={() => navigate(-1)}
          aria-label="Chiudi"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <header className="auth-header">
          <span className="auth-badge">Crea il tuo account</span>
          <h1 className="auth-title">Registrati</h1>
          <p className="auth-intro">
            Un account per ordini, spedizioni e molto altro.
          </p>
        </header>

        <div className="auth-card">
          {!authAvailable && (
            <div className="auth-unavailable" role="alert">
              <strong>Registrazione non disponibile su questo dominio.</strong>
              <p>Per abilitare la registrazione:</p>
              <ol>
                <li>Vercel → Settings → Environment Variables: aggiungi tutte le variabili <code>VITE_FIREBASE_*</code>, poi <strong>Redeploy</strong>.</li>
                <li>Firebase Console → Authentication → Authorized domains: aggiungi <code>{typeof window !== "undefined" ? window.location.hostname : "questo dominio"}</code>.</li>
              </ol>
            </div>
          )}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Mario"
                required
                autoComplete="given-name"
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="cognome">Cognome</label>
              <input
                id="cognome"
                type="text"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
                placeholder="Rossi"
                required
                autoComplete="family-name"
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="telefono">Numero di telefono</label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={handleTelefonoChange}
                placeholder="+39 333 123 4567"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={18}
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.it"
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Almeno 6 caratteri"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="confirmPassword">Conferma password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ripeti la password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading || !authAvailable}>
              {loading ? "Registrazione in corso..." : "Crea account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Hai già un account?</p>
            <Link to="/login" className="auth-footer-cta">Accedi</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
