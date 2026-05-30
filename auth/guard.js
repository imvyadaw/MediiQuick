import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth, callFunction } from '../services/firebase.js';
import { ROLE_LOGIN } from './roles.js';

const validateSession = callFunction('validateSession');

export function waitForUser(timeoutMs = 4000) {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  return new Promise(resolve => {
    let unsub = () => {};
    const timer = setTimeout(() => { unsub(); resolve(auth.currentUser || null); }, timeoutMs);
    unsub = onAuthStateChanged(auth, user => {
      clearTimeout(timer);
      unsub();
      resolve(user || null);
    });
  });
}

export async function requireBackendRole(role, options = {}) {
  const redirectTo = options.redirectTo || ROLE_LOGIN[role] || 'login.html';
  const user = await waitForUser(options.timeoutMs || 4000);
  if (!user) {
    if (options.redirect !== false) location.replace(redirectTo);
    return null;
  }

  try {
    const res = await validateSession({ role });
    const data = res.data || {};
    if (!data.ok || data.role !== role) throw new Error('role-denied');
    return { user, claims: data.claims || {}, profile: data.profile || null };
  } catch (_) {
    if (options.redirect !== false) location.replace(redirectTo);
    return null;
  }
}

export async function logoutTo(role = 'customer') {
  try { await signOut(auth); } finally { location.href = ROLE_LOGIN[role] || 'login.html'; }
}
