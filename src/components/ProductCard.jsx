import { useState } from "react";
import { Link } from "react-router-dom";
import { getPublicUrl } from "../utils/publicUrl";
import AddToCartModal from "./AddToCartModal";

export default function ProductCard({ product }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article className="product-card">
        <Link to={`/shop/${product.id}`} className="product-card-link">
          <div className="product-card-image">
            <img src={getPublicUrl(product.image)} alt={product.name} />
          </div>
          <div className="product-card-body">
            <span className="product-category">{product.category}</span>
            <h3>{product.name}</h3>
            <p className="product-price">€ {product.price.toFixed(2)}</p>
          </div>
        </Link>
        <button
          type="button"
          className="btn btn-add-quick"
          onClick={(e) => {
            e.preventDefault();
            setModalOpen(true);
          }}
        >
          Aggiungi al carrello
        </button>
      </article>
      {modalOpen && (
        <AddToCartModal
          product={product}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
