// utils.js
// All utility functions in one place - import from here in all pages

// Haversine formula - Earth distance calculation
function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Password hash using SHA-256 (with salt)
async function hashPassword(plain, userSalt = null) {
  const encoder = new TextEncoder();
  const salt = userSalt || 'mq_salt_2024';
  const data = encoder.encode(plain + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
async function verifyPassword(plain, storedHash, userSalt = null) {
  const hash = await hashPassword(plain, userSalt);
  return hash === storedHash;
}

// XSS Prevention - Safe HTML escaping
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Format currency
function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// Format date
function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Generate random ID
function generateId(prefix = '') {
  return prefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Debounce function for search inputs
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate mobile (Indian)
function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

// Validate PIN code
function isValidPincode(pincode) {
  return /^\d{6}$/.test(pincode);
}

// Get order status badge HTML
function getStatusBadge(status) {
  const config = {
    pending: { class: 'badge-pending', label: '⏳ Pending', icon: 'fa-clock' },
    confirmed: { class: 'badge-confirmed', label: '📋 Confirmed', icon: 'fa-check-circle' },
    packing: { class: 'badge-packing', label: '📦 Packing', icon: 'fa-box' },
    on_the_way: { class: 'badge-on_the_way', label: '🚴 On the Way', icon: 'fa-motorcycle' },
    delivered: { class: 'badge-delivered', label: '✅ Delivered', icon: 'fa-check-circle' },
    cancelled: { class: 'badge-cancelled', label: '❌ Cancelled', icon: 'fa-times-circle' },
    pending_acceptance: { class: 'badge-pending_acceptance', label: '🏍️ Awaiting Rider', icon: 'fa-clock' }
  };
  const c = config[status] || config.pending;
  return `<span class="badge ${c.class}"><i class="fas ${c.icon}"></i> ${c.label}</span>`;
}

// Session management
const SessionManager = {
  // Customer
  getCustomer: () => {
    try {
      const session = localStorage.getItem('mq_user');
      if (!session) return null;
      const data = JSON.parse(session);
      if (data.expiresAt && Date.now() > data.expiresAt) {
        localStorage.removeItem('mq_user');
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  },
  
  setCustomer: (data) => {
    data.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('mq_user', JSON.stringify(data));
  },
  
  // Admin
  getAdmin: () => {
    try {
      const session = localStorage.getItem('mq_admin_session');
      if (!session) return null;
      const data = JSON.parse(session);
      if (data.expiresAt && Date.now() > data.expiresAt) {
        localStorage.removeItem('mq_admin_session');
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  },
  
  setAdmin: (data) => {
    data.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('mq_admin_session', JSON.stringify(data));
  },
  
  // Rider
  getRider: () => {
    try {
      const session = localStorage.getItem('mq_db_session');
      if (!session) return null;
      const data = JSON.parse(session);
      if (data.expiresAt && Date.now() > data.expiresAt) {
        localStorage.removeItem('mq_db_session');
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  },
  
  setRider: (data) => {
    data.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('mq_db_session', JSON.stringify(data));
  },
  
  // Logout all
  logoutAll: () => {
    localStorage.removeItem('mq_user');
    localStorage.removeItem('mq_admin_session');
    localStorage.removeItem('mq_db_session');
  }
};

// Toast notification
let toastTimer = null;
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.getElementById('global-mq-toast');
  if (existing) existing.remove();
  if (toastTimer) clearTimeout(toastTimer);
  
  const toast = document.createElement('div');
  toast.id = 'global-mq-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: ${type === 'error' ? '#dc2626' : type === 'warning' ? '#f59e0b' : '#16a34a'};
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    z-index: 9999;
    transition: transform 0.3s ease;
    white-space: nowrap;
    max-width: 90vw;
    white-space: normal;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-family: 'Poppins', sans-serif;
  `;
  toast.innerHTML = `${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'} ${message}`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);
  
  toastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Loading spinner
function showLoading(elementId, text = 'Loading...') {
  const el = document.getElementById(elementId);
  if (el) {
    el.disabled = true;
    el.dataset.originalText = el.innerHTML;
    el.innerHTML = `<span class="loading-spinner" style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:8px;"></span> ${text}`;
  }
}

function hideLoading(elementId) {
  const el = document.getElementById(elementId);
  if (el && el.dataset.originalText) {
    el.disabled = false;
    el.innerHTML = el.dataset.originalText;
    delete el.dataset.originalText;
  }
}

// Add spin animation to document if not exists
if (!document.querySelector('#mq-spin-style')) {
  const style = document.createElement('style');
  style.id = 'mq-spin-style';
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

// Export all utilities
window.MQUtils = {
  getDistanceKm,
  hashPassword,
  verifyPassword,
  escapeHTML,
  formatCurrency,
  formatDate,
  generateId,
  debounce,
  isValidEmail,
  isValidMobile,
  isValidPincode,
  getStatusBadge,
  SessionManager,
  showToast,
  showLoading,
  hideLoading
};