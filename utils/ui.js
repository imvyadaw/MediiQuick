import { escapeHTML } from './sanitize.js';

let toastTimer = null;

export function showToast(message, type = 'success') {
  const old = document.getElementById('mq-global-toast');
  if (old) old.remove();
  if (toastTimer) clearTimeout(toastTimer);

  const toast = document.createElement('div');
  toast.id = 'mq-global-toast';
  toast.className = `mq-toast mq-toast-${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

export function setLoading(button, isLoading, text = 'Loading...') {
  const el = typeof button === 'string' ? document.getElementById(button) : button;
  if (!el) return;
  if (isLoading) {
    el.disabled = true;
    el.dataset.originalHtml = el.innerHTML;
    el.innerHTML = `<span class="mq-spinner" aria-hidden="true"></span>${escapeHTML(text)}`;
  } else {
    el.disabled = false;
    if (el.dataset.originalHtml) el.innerHTML = el.dataset.originalHtml;
    delete el.dataset.originalHtml;
  }
}

export function renderSkeleton(container, rows = 3) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  el.innerHTML = Array.from({ length: rows }, () => '<div class="mq-skeleton"></div>').join('');
}

export function installCommonUiStyles() {
  if (document.getElementById('mq-common-ui-styles')) return;
  const style = document.createElement('style');
  style.id = 'mq-common-ui-styles';
  style.textContent = `
    .mq-toast{position:fixed;left:50%;bottom:22px;transform:translate(-50%,80px);z-index:9999;max-width:min(92vw,460px);padding:12px 18px;border-radius:10px;color:#fff;font:600 14px/1.35 system-ui,sans-serif;box-shadow:0 12px 32px rgba(15,23,42,.18);transition:transform .22s ease,opacity .22s ease;opacity:0}.mq-toast.show{transform:translate(-50%,0);opacity:1}.mq-toast-success{background:#15803d}.mq-toast-error{background:#dc2626}.mq-toast-warning{background:#d97706}.mq-spinner{display:inline-block;width:16px;height:16px;margin-right:8px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:999px;vertical-align:-3px;animation:mqSpin .75s linear infinite}.mq-skeleton{height:14px;border-radius:7px;background:linear-gradient(90deg,#e5e7eb,#f8fafc,#e5e7eb);background-size:220% 100%;animation:mqPulse 1.1s ease-in-out infinite;margin:10px 0}@keyframes mqSpin{to{transform:rotate(360deg)}}@keyframes mqPulse{to{background-position:-220% 0}}@media(max-width:640px){.mq-toast{bottom:14px;font-size:13px;padding:11px 14px}}
  `;
  document.head.appendChild(style);
}

installCommonUiStyles();
