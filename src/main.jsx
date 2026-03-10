import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";
import App from "./App.jsx";

const basename = import.meta.env.BASE_URL === './' ? '/abbigliamento' : (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

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
