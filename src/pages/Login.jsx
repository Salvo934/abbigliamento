import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, resetPassword, authAvailable } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ricordami, setRicordami] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast("Accesso effettuato");
      navigate(-1);
    } catch (err) {
      const msg = err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
        ? "Email o password non corretti"
        : err.code === "auth/invalid-email"
          ? "Email non valida"
          : err.message || "Errore di accesso";
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Inserisci l'email per reimpostare la password");
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      showToast("Email di reset inviata. Controlla la casella.");
    } catch (err) {
      showToast(err.message || "Errore nell'invio dell'email");
    }
  };

  return (
    <div className="page page-auth page-login">
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
          <span className="auth-badge">Accedi al tuo account</span>
          <h1 className="auth-title">Benvenuto</h1>
          <p className="auth-intro">
            Inserisci email e password per continuare.
          </p>
        </header>

        <div className="auth-card">
          {!authAvailable && (
            <div className="auth-unavailable" role="alert">
              <strong>Accesso non disponibile su questo dominio.</strong>
              <p>Per abilitare login su questo sito (es. Vercel):</p>
              <ol>
                <li>Vercel → Settings → Environment Variables: aggiungi <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_AUTH_DOMAIN</code>, <code>VITE_FIREBASE_PROJECT_ID</code> e le altre variabili Firebase, poi fai <strong>Redeploy</strong>.</li>
                <li>Firebase Console → Authentication → Settings → Authorized domains: aggiungi <code>{typeof window !== "undefined" ? window.location.hostname : "questo dominio"}</code>.</li>
              </ol>
              <p>Vedi <code>FIREBASE.md</code> nel progetto.</p>
            </div>
          )}
          <form className="auth-form" onSubmit={handleSubmit}>
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
              <div className="auth-form-label-row">
                <label htmlFor="password">Password</label>
                <Link to="#" className="auth-link" onClick={handleForgotPassword}>
                  {resetSent ? "Email inviata" : "Password dimenticata?"}
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <label className="auth-remember">
              <input type="checkbox" checked={ricordami} onChange={(e) => setRicordami(e.target.checked)} />
              <span>Ricordami</span>
            </label>
            <button type="submit" className="auth-submit" disabled={loading || !authAvailable}>
              {loading ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Non hai un account?</p>
            <Link to="/registrati" className="auth-footer-cta">Crea account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
