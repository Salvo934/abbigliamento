import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (cartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartDrawerOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleCartDrawer = () => setCartDrawerOpen((o) => !o);
  const closeCartDrawer = () => setCartDrawerOpen(false);

  return (
    <header className="header">
      <div className="header-inner">
        <button
          type="button"
          className={`nav-toggle ${menuOpen ? "nav-toggle-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          aria-controls="main-nav"
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
        <Link to="/" className="logo" onClick={closeMenu}>
          Flowvix
        </Link>
        <div className="header-actions">
          <Link to="/login" className="header-accedi" aria-label="Accedi">
            <svg className="header-accedi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20a7 7 0 0 1 14 0" />
            </svg>
          </Link>
          <button
            type="button"
            className="header-cart"
            onClick={toggleCartDrawer}
            aria-label={`Carrello${cartCount > 0 ? `, ${cartCount} articoli` : ""}`}
            aria-expanded={cartDrawerOpen}
          >
            <span className="header-cart-icon" aria-hidden>🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
      <CartDrawer isOpen={cartDrawerOpen} onClose={closeCartDrawer} />
      <div
        className={`nav-overlay ${menuOpen ? "nav-overlay-visible" : ""}`}
        onClick={closeMenu}
        onKeyDown={(e) => e.key === "Escape" && closeMenu()}
        role="button"
        tabIndex={-1}
        aria-label="Chiudi menu"
      />
      <nav
        id="main-nav"
        className={`nav ${menuOpen ? "nav-open" : ""}`}
        aria-label="Menu principale"
      >
        <div className="nav-drawer-header">
          <span className="nav-drawer-title">Menu</span>
          <button
            type="button"
            className="nav-close"
            onClick={closeMenu}
            aria-label="Chiudi menu"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <ul className="nav-list">
          <li>
            <Link to="/" onClick={closeMenu} className="nav-link">
              <span className="nav-link-icon" aria-hidden>🏠</span>
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" onClick={closeMenu} className="nav-link">
              <span className="nav-link-icon" aria-hidden>🛍️</span>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/contatti" onClick={closeMenu} className="nav-link">
              <span className="nav-link-icon" aria-hidden>✉️</span>
              Contatti
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={closeMenu} className="nav-link">
              <span className="nav-link-icon" aria-hidden>👤</span>
              Accedi
            </Link>
          </li>
          <li className="nav-item-cart">
            <Link to="/carrello" onClick={closeMenu} className="nav-link cart-link">
              <span className="nav-link-icon" aria-hidden>🛒</span>
              Carrello
              {cartCount > 0 && (
                <span className="cart-badge" aria-label={`${cartCount} articoli`}>{cartCount}</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
