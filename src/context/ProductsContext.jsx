import { createContext, useContext, useState } from "react";
import { getProductByIdFromList } from "../services/productsService";
import { products as localProducts, categories as localCategories } from "../data/products";

const localProductsNormalized = localProducts.map((p) => ({ ...p, id: String(p.id) }));

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products] = useState(localProductsNormalized);
  const [categories] = useState(localCategories);
  const loading = false;

  const getProductById = (id) => getProductByIdFromList(products, id);

  return (
    <ProductsContext.Provider value={{ products, categories, loading, getProductById }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
