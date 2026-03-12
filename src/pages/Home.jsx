import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";

const PARTICLE_COUNT = 48;
const LINE_1 = "Find";
const LINE_2 = "your Flow";
const TYPE_SPEED = 90;
const PAUSE_BETWEEN_LINES = 400;

export default function Home() {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 4);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const timeoutsRef = useRef([]);

  useEffect(() => {
    let t1 = 0;
    let t2 = 0;
    const addTimeout = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
    };
    const typeLine1 = () => {
      if (t1 <= LINE_1.length) {
        setLine1(LINE_1.slice(0, t1));
        t1++;
        addTimeout(typeLine1, TYPE_SPEED);
      } else {
        addTimeout(typeLine2, PAUSE_BETWEEN_LINES);
      }
    };
    const typeLine2 = () => {
      if (t2 <= LINE_2.length) {
        setLine2(LINE_2.slice(0, t2));
        t2++;
        addTimeout(typeLine2, TYPE_SPEED);
      } else {
        setShowCursor(false);
      }
    };
    addTimeout(typeLine1, 500);
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  const scrollToFeatured = () => {
    document.getElementById("in-evidenza")?.scrollIntoView({ behavior: "smooth" });
  };

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      top: 5 + Math.random() * 90,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 5,
    }));
  }, []);

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-bg" aria-hidden>
          <span className="hero-bg-circle" />
          <div className="hero-particles" aria-hidden>
            {particles.map((p) => (
              <span
                key={p.id}
                className="hero-particle"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                }}
              />
            ))}
          </div>
        </div>
        <Link to="/shop" className="hero-label">
          Nuova collezione
        </Link>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-line hero-line-1">
              {line1}
              {showCursor && line1.length < LINE_1.length && <span className="hero-cursor" aria-hidden>|</span>}
            </span>
            <span className="hero-line hero-line-2">
              {line2}
              {showCursor && line1.length === LINE_1.length && <span className="hero-cursor" aria-hidden>|</span>}
            </span>
          </h1>
          <p className="hero-desc">
          Comfort e stile pensati per il tuo ritmo quotidiano.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary">
              Scopri la collezione
            </Link>
            <button type="button" className="btn btn-secondary" onClick={scrollToFeatured}>
              In evidenza
            </button>
          </div>
        </div>
      </section>

      <section id="in-evidenza" className="featured section">
        <div className="featured-header">
          <span className="featured-label">I più amati</span>
          <h2>In evidenza</h2>
          <p className="featured-desc">
            Una selezione dei nostri capi più richiesti. Qualità e design per il tuo guardaroba.
          </p>
        </div>
        <div className="product-grid product-grid-featured">
          {loading ? (
            <p className="featured-loading">Caricamento...</p>
          ) : (
            featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        <div className="section-cta">
          <Link to="/shop" className="btn btn-primary btn-with-arrow">
            Scopri tutta la collezione
            <span className="btn-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="home-trust section">
        <ul className="trust-list">
          <li>
            <span className="trust-icon" aria-hidden>✓</span>
            <span>Spedizione rapida</span>
          </li>
          <li>
            <span className="trust-icon" aria-hidden>✓</span>
            <span>Resi facili</span>
          </li>
          <li>
            <span className="trust-icon" aria-hidden>✓</span>
            <span>Qualità premium</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
