import { Outlet } from "react-router-dom";
import TopBanner from "./TopBanner";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <TopBanner />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
