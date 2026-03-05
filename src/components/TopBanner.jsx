export default function TopBanner() {
  const text = "Acquisti superiori a 100 euro il reso è gratuito";

  return (
    <div className="top-banner" role="marquee" aria-live="polite">
      <div className="top-banner-inner">
        <span className="top-banner-text">{text}</span>
        <span className="top-banner-text" aria-hidden>{text}</span>
        <span className="top-banner-text" aria-hidden>{text}</span>
      </div>
    </div>
  );
}
