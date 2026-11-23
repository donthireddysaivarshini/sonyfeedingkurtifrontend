/**
 * Utility to resolve image URLs coming from Django backend or local seed data.
 * Prepends backend URL when the image path is relative or points to /media/.
 */
const BACKEND_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api')
  .replace(/\/api\/?$/, '');

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/media/')) {
    return `${BACKEND_BASE}${trimmed}`;
  }
  if (trimmed.startsWith('media/')) {
    return `${BACKEND_BASE}/${trimmed}`;
  }
  if (trimmed.startsWith('/images/')) {
    const relative = trimmed.replace(/^\/images\//, '');
    return `${BACKEND_BASE}/media/${relative}`;
  }
  // Relative media path (e.g. 'frocks/...', 'products/...')
  const cleanPath = trimmed.replace(/^\//, '');
  return `${BACKEND_BASE}/media/${cleanPath}`;
}
