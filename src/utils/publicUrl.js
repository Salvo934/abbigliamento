/**
 * URL base per i file in public/ (GitHub Pages e locale).
 */
export function getPublicUrl(path) {
  const basename =
    import.meta.env.BASE_URL === './'
      ? '/abbigliamento'
      : (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return basename + (path.startsWith('/') ? path : '/' + path);
}
