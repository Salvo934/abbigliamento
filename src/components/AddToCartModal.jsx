import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function AddToCartModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    if (!size) return;
    addToCart(product, size, quantity);
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
            <img src={product.image} alt={product.name} />
          </div>
          <div className="modal-info">
            <span className="product-category">{product.category}</span>
            <h2 id="modal-title">{product.name}</h2>
            <p className="modal-price">€ {product.price.toFixed(2)}</p>
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
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              />
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
