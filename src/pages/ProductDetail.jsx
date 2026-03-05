import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="page">
        <p>Prodotto non trovato.</p>
        <button onClick={() => navigate("/shop")}>Torna allo Shop</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!size) {
      showToast("Seleziona una taglia");
      return;
    }
    addToCart(product, size, quantity);
    showToast("Aggiunto al carrello");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="page product-detail-page">
      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-price">€ {product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

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
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <button
            className="btn btn-primary btn-add-cart"
            onClick={handleAddToCart}
          >
            {added ? "Aggiunto al carrello ✓" : "Aggiungi al carrello"}
          </button>

          <button className="btn btn-secondary" onClick={() => navigate("/shop")}>
            Torna allo Shop
          </button>
        </div>
      </div>
    </div>
  );
}
