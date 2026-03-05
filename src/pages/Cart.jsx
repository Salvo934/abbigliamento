import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="page cart-page">
        <h1>Carrello</h1>
        <div className="cart-empty">
          <p>Il tuo carrello è vuoto.</p>
          <Link to="/shop" className="btn btn-primary">
            Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <h1>Carrello ({cartCount} {cartCount === 1 ? "articolo" : "articoli"})</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Taglia: {item.size}</p>
                <p className="cart-item-price">€ {item.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-qty">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity - 1)
                  }
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <p className="cart-item-total">
                € {(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                className="cart-remove"
                onClick={() => removeFromCart(item.id, item.size)}
                aria-label="Rimuovi"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Riepilogo</h3>
          <p className="cart-total">
            Totale: <strong>€ {cartTotal.toFixed(2)}</strong>
          </p>
          <Link to="/shop" className="btn btn-secondary btn-block">
            Shop
          </Link>
          <Link to="/checkout" className="btn btn-primary btn-block btn-with-arrow">
            Procedi al checkout
            <span className="btn-arrow" aria-hidden>→</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
