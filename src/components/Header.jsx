import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const { cartCount } = useCart();
  const { user, signOut, isLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

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

  useEffect(() => {
    if (!accountMenuOpen) return;
    const closeOnClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    const closeOnEscape = (e) => {
      if (e.key === "Escape") setAccountMenuOpen(false);
    };
    document.addEventListener("click", closeOnClickOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOnClickOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountMenuOpen]);

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
              <NavLink to="/" onClick={closeMenu} className="nav-link" end>
                <span className="nav-link-icon" aria-hidden>🏠</span>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" onClick={closeMenu} className="nav-link">
                <span className="nav-link-icon" aria-hidden>🛍️</span>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/contatti" onClick={closeMenu} className="nav-link">
                <span className="nav-link-icon" aria-hidden>✉️</span>
                Contatti
              </NavLink>
            </li>
          <li className="nav-item-accedi">
            {isLoggedIn ? (
              <button type="button" onClick={() => { signOut(); closeMenu(); }} className="nav-link nav-link-logout">
                <span className="nav-link-icon" aria-hidden>👤</span>
                Esci
              </button>
            ) : (
              <Link to="/login" onClick={closeMenu} className="nav-link">
                <span className="nav-link-icon" aria-hidden>👤</span>
                Accedi
              </Link>
            )}
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
        <div className="header-actions">
          {isLoggedIn ? (
            <div className="header-account-wrap" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((o) => !o)}
                className={`header-account header-account--logged ${accountMenuOpen ? "is-open" : ""}`}
                aria-label="Menu account"
                aria-expanded={accountMenuOpen}
                aria-haspopup="true"
                title={user?.email ?? "Account"}
              >
                <span className="header-account-initial" aria-hidden>
                  {user?.email?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </button>
              <div className={`header-account-dropdown ${accountMenuOpen ? "is-open" : ""}`} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="header-account-dropdown-item header-account-dropdown-logout"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    signOut();
                  }}
                >
                  <span className="header-account-dropdown-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </span>
                  Esci
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="header-account" aria-label="Accedi" title="Accedi">
              <svg className="header-account-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </Link>
          )}
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
    </header>
  );
}
