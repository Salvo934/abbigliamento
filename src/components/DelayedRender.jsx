import { useState, useEffect } from "react";

/**
 * Mostra il placeholder per almeno minDelay ms, poi i children.
 * Così il loader full-page si vede bene anche quando il caricamento è velocissimo.
 */
export default function DelayedRender({ children, placeholder, minDelay = 1200 }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), minDelay);
    return () => clearTimeout(t);
  }, [minDelay]);

  if (!ready) return placeholder;
  return children;
}
