/**
 * URL base per i file in public/ (Vercel = root, GitHub Pages = /abbigliamento).
 */
export function getPublicUrl(path) {
  const basename =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/abbigliamento')
      ? '/abbigliamento'
      : (import.meta.env.BASE_URL === './' ? '' : (import.meta.env.BASE_URL || '/').replace(/\/$/, ''));
  return basename + (path.startsWith('/') ? path : '/' + path);
}
