/**
 * Loader full-page per Suspense (reload / cambio route).
 * Stile minimale e professionale in linea con il brand.
 */
export default function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Caricamento">
      <div className="page-loader-inner">
        <span className="page-loader-brand">FlowVix</span>
        <div className="page-loader-bar">
          <div className="page-loader-bar-fill" />
        </div>
        <span className="page-loader-dots">
          <span className="page-loader-dot" />
          <span className="page-loader-dot" />
          <span className="page-loader-dot" />
        </span>
      </div>
    </div>
  );
}
