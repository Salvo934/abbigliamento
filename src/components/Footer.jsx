import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <Link to="/" className="footer-logo">
            Flowvix
          </Link>
          <p className="footer-tagline">
            Moda di qualità per ogni occasione. Tessuti curati e stile senza tempo.
          </p>
          <p className="footer-promo">
            Reso gratuito per acquisti oltre 100€
          </p>
        </div>
        <div className="footer-col">
          <h4>Navigazione</h4>
          <nav className="footer-nav" aria-label="Footer">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/contatti">Contatti</Link>
            <Link to="/login">Login</Link>
            <Link to="/carrello">Carrello</Link>
          </nav>
        </div>
        <div className="footer-col">
          <h4>Contatti</h4>
          <ul className="footer-contacts">
            <li>
              <a href="mailto:info@abbigliamento.it">
                <span className="footer-contact-icon" aria-hidden>✉️</span>
                info@abbigliamento.it
              </a>
            </li>
            <li>
              <a href="tel:+39021234567">
                <span className="footer-contact-icon" aria-hidden>📞</span>
                +39 02 1234567
              </a>
            </li>
            <li>
              <span className="footer-contact-icon" aria-hidden>📍</span>
              Via Roma 1, 20100 Milano
            </li>
          </ul>
        </div>
        <div className="footer-col footer-services">
          <h4>Servizi</h4>
          <ul className="footer-services-list">
            <li>Spedizione in 3-5 giorni</li>
            <li>Reso gratuito oltre 100€</li>
            <li>Pagamento sicuro</li>
            <li>Assistenza dedicata</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">
          © {currentYear} Flowvix. Tutti i diritti riservati.
        </p>
        <div className="footer-legal">
          <Link to="#">Privacy Policy</Link>
          <span className="footer-legal-sep">·</span>
          <Link to="#">Termini di servizio</Link>
        </div>
      </div>
    </footer>
  );
}
