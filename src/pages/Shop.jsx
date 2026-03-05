import { useState } from "react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("tutti");

  const filtered =
    selectedCategory === "tutti"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="page shop-page">
      <header className="shop-header">
        <div className="shop-header-content">
          <h1>Shop</h1>
          <p className="shop-header-subtitle">Tutta la nostra collezione</p>
        </div>
        <p className="shop-header-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "prodotto" : "prodotti"}
        </p>
      </header>
      <div className="shop-layout">
        <aside className="filters" aria-label="Filtra per categoria">
          <h3 className="filters-title">Categorie</h3>
          <ul className="filters-list">
            {categories.map((cat) => {
              const count =
                cat.id === "tutti"
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    className={`filters-btn ${selectedCategory === cat.id ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="filters-btn-label">{cat.label}</span>
                    <span className="filters-btn-count">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
        <div className="shop-main">
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="shop-empty">
              <p>Nessun prodotto in questa categoria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
