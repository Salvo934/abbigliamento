import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOpen ? "cart-drawer-overlay-visible" : ""}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Chiudi carrello"
      />
      <div
        className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}
        role="dialog"
        aria-label="Carrello"
      >
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Carrello</h2>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>
        <div className="cart-drawer-body">
          {cartCount === 0 ? (
            <p className="cart-drawer-empty">Il carrello è vuoto.</p>
          ) : (
            <>
              <ul className="cart-drawer-list">
                {cart.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="cart-drawer-item">
                    <img src={item.image} alt="" />
                    <div className="cart-drawer-item-info">
                      <span className="cart-drawer-item-name">{item.name}</span>
                      <span className="cart-drawer-item-meta">
                        {item.size} × {item.quantity} — €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="cart-drawer-item-actions">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        aria-label="Diminuisci"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        aria-label="Aumenta"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="cart-drawer-remove"
                        onClick={() => removeFromCart(item.id, item.size)}
                        aria-label="Rimuovi"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-drawer-total">
                Totale: <strong>€ {cartTotal.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>
        <div className="cart-drawer-footer">
          <Link to="/shop" className="btn btn-secondary btn-block" onClick={onClose}>
            Shop
          </Link>
          {cartCount > 0 && (
            <Link to="/checkout" className="btn btn-primary btn-block btn-with-arrow" onClick={onClose}>
              Procedi al checkout
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
