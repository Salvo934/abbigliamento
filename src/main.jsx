import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { ProductsProvider } from "./context/ProductsContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import App from "./App.jsx";

const basename =
  typeof window !== "undefined" && window.location.pathname.startsWith("/abbigliamento")
    ? "/abbigliamento"
    : (import.meta.env.BASE_URL === "./" ? "" : (import.meta.env.BASE_URL || "/").replace(/\/$/, ""));

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
