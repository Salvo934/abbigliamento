import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getPublicUrl } from "../utils/publicUrl";

export default function AddToCartModal({ product, initialColor, onClose }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const colors = product?.colors || ["Bianco", "Nero"];
  const [size, setSize] = useState("");
  const [color, setColor] = useState(initialColor || colors[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    if (!size) return;
    addToCart(product, size, color, quantity);
    showToast("Aggiunto al carrello");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Chiudi">
          ×
        </button>
        <div className="modal-body">
          <div className="modal-image">
            <img src={getPublicUrl(product.image)} alt={product.name} />
          </div>
          <div className="modal-info">
            <span className="product-category">{product.category}</span>
            <h2 id="modal-title">{product.name}</h2>
            <p className="modal-price">€ {product.price.toFixed(2)}</p>
            <div className="form-group">
              <label>Colore</label>
              <div className="color-options">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-btn color-btn--${c.toLowerCase()} ${color === c ? "active" : ""}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Taglia</label>
              <div className="size-options">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-btn ${size === s ? "active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Quantità</label>
              <div className="quantity-selector">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuisci quantità"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="quantity-value" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Aumenta quantità"
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleAdd}
              disabled={!size}
            >
              Aggiungi al carrello
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
