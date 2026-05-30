export function escapeHTML(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function setText(el, value) {
  if (el) el.textContent = value ?? '';
}

export function safeUrl(value, allowed = ['https:', 'http:', 'mailto:', 'tel:']) {
  try {
    const url = new URL(value, location.origin);
    return allowed.includes(url.protocol) ? url.href : '#';
  } catch (_) {
    return '#';
  }
}
