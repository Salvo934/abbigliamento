import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";
import App from "./App.jsx";

const basename =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/abbigliamento')
    ? '/abbigliamento'
    : (import.meta.env.BASE_URL === './' ? '' : (import.meta.env.BASE_URL || '/').replace(/\/$/, ''));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <CartProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
