export function sanitizeText(text) {
  return String(text ?? '').replace(/<[^>]*>/g, '').slice(0, 4000);
}