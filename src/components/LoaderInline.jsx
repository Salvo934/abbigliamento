/**
 * Loader inline per sezioni (grid prodotti, dettaglio, ecc.).
 * Skeleton o spinner compatto.
 * @param {boolean} gridParent - Se true, non wrappa in una grid (i card sono figli diretti del parent con grid)
 */
export default function LoaderInline({ type = "spinner", count = 1, gridParent = false }) {
  if (type === "skeleton-cards") {
    const card = (i) => (
      <div key={i} className="loader-skeleton-card">
        <div className="loader-skeleton-img" />
        <div className="loader-skeleton-line loader-skeleton-title" />
        <div className="loader-skeleton-line loader-skeleton-price" />
      </div>
    );
    if (gridParent) {
      return <>{Array.from({ length: count }, (_, i) => card(i))}</>;
    }
    return (
      <div className="loader-skeleton-grid" aria-hidden>
        {Array.from({ length: count }, (_, i) => card(i))}
      </div>
    );
  }
  if (type === "skeleton-detail") {
    return (
      <div className="loader-skeleton-detail" aria-hidden>
        <div className="loader-skeleton-detail-gallery">
          <div className="loader-skeleton-img" />
        </div>
        <div className="loader-skeleton-detail-info">
          <div className="loader-skeleton-line loader-skeleton-title" style={{ width: "70%" }} />
          <div className="loader-skeleton-line" style={{ width: "40%" }} />
          <div className="loader-skeleton-line" style={{ width: "25%", marginTop: "1.5rem" }} />
          <div className="loader-skeleton-detail-options">
            <div className="loader-skeleton-line" style={{ width: "100%", height: 48 }} />
            <div className="loader-skeleton-line" style={{ width: "80%", height: 48, marginTop: "0.75rem" }} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="loader-inline" role="status" aria-label="Caricamento">
      <div className="loader-spinner" />
      <span className="loader-inline-text">Caricamento...</span>
    </div>
  );
}
