import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ricordami, setRicordami] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: login
    alert("Accesso in fase di sviluppo. Presto potrai accedere al tuo account.");
  };

  return (
    <div className="page page-login">
      <div className="login-wrapper">
        <header className="login-header">
          <button
            type="button"
            className="login-close"
            onClick={() => navigate(-1)}
            aria-label="Chiudi"
          >
            ×
          </button>
          <span className="login-label">Account</span>
          <h1>Accedi</h1>
          <p className="login-intro">
            Inserisci le tue credenziali per accedere al tuo account e gestire ordini e preferiti.
          </p>
        </header>

        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
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
            <div className="form-group">
              <div className="form-group-label">
                <label htmlFor="password">Password</label>
                <Link to="#" className="login-forgot" onClick={(e) => e.preventDefault()}>
                  Password dimenticata?
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
            <label className="login-remember">
              <input
                type="checkbox"
                checked={ricordami}
                onChange={(e) => setRicordami(e.target.checked)}
              />
              <span>Ricordami</span>
            </label>
            <button type="submit" className="btn btn-primary btn-block">
              Accedi
            </button>
          </form>

          <p className="login-register">
            Non hai un account?{" "}
            <Link to="#" className="login-register-link" onClick={(e) => e.preventDefault()}>
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
