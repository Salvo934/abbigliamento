import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PageLoader from "./components/PageLoader";
import DelayedRender from "./components/DelayedRender";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const Contatti = lazy(() => import("./pages/Contatti"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <DelayedRender placeholder={<PageLoader />} minDelay={1200}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetail />} />
          <Route path="carrello" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/success" element={<CheckoutSuccess />} />
          <Route path="contatti" element={<Contatti />} />
          <Route path="login" element={<Login />} />
          <Route path="registrati" element={<Register />} />
        </Route>
      </Routes>
      </DelayedRender>
    </Suspense>
  );
}
