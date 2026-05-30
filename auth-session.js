// auth-session.js - shared role session helpers for MediiQuick
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export const SESSION_KEYS = {
  customer: 'mq_user',
  admin: 'mq_admin_session',
  rider: 'mq_db_session'
};

export const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

export function normalizeSession(role, data = {}) {
  const base = { expiresAt: Date.now() + SESSION_TTL };
  if (role === 'customer') {
    return {
      ...base,
      uid: data.uid || '',
      email: (data.email || '').toLowerCase(),
      name: data.name || '',
      mobile: data.mobile || '',
      lat: data.lat ?? null,
      lng: data.lng ?? null
    };
  }
  if (role === 'admin') {
    return {
      ...base,
      uid: data.uid || '',
      docId: data.docId || data.adminId || '',
      adminId: data.adminId || data.docId || '',
      email: (data.email || '').toLowerCase(),
      shopName: data.shopName || '',
      adminName: data.adminName || '',
      city: data.city || '',
      deliveryRadius: data.deliveryRadius || '5',
      servedPins: Array.isArray(data.servedPins) ? data.servedPins : [],
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      location: data.location || '',
      mobile: data.mobile || '',
      mobile2: data.mobile2 || '',
      drugLicense: data.drugLicense || '',
      pin: data.pin || '',
      gst: data.gst || '',
      openTime: data.openTime || '',
      closeTime: data.closeTime || '',
      shopType: data.shopType || ''
    };
  }
  if (role === 'rider') {
    return {
      ...base,
      uid: data.uid || '',
      docId: data.docId || data.id || '',
      email: (data.email || '').toLowerCase(),
      phone: data.phone || '',
      name: data.name || '',
      city: data.city || '',
      vehicle: data.vehicle || 'bike',
      deliveryRange: data.deliveryRange || 10,
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      sessionToken: data.sessionToken || ''
    };
  }
  return { ...data, ...base };
}

export function saveSession(role, data) {
  const session = normalizeSession(role, data);
  localStorage.setItem(SESSION_KEYS[role], JSON.stringify(session));
  return session;
}

export function getSession(role) {
  try {
    const raw = localStorage.getItem(SESSION_KEYS[role]);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || (session.expiresAt && Date.now() > session.expiresAt)) {
      localStorage.removeItem(SESSION_KEYS[role]);
      return null;
    }
    return session;
  } catch (_) {
    localStorage.removeItem(SESSION_KEYS[role]);
    return null;
  }
}

export function refreshSession(role, data = {}) {
  const current = getSession(role) || {};
  return saveSession(role, { ...current, ...data });
}

export function clearSession(role) {
  localStorage.removeItem(SESSION_KEYS[role]);
}

export async function waitForAuthUser(auth = getAuth(), timeoutMs = 3000) {
  if (auth.currentUser) return auth.currentUser;
  return new Promise(resolve => {
    let unsub = () => {};
    const timer = setTimeout(() => {
      unsub();
      resolve(auth.currentUser || null);
    }, timeoutMs);
    unsub = onAuthStateChanged(auth, user => {
      clearTimeout(timer);
      unsub();
      resolve(user || null);
    });
  });
}

export async function ensureAuthUser(auth, email, password) {
  const current = await waitForAuthUser(auth, 1000);
  if (current && (!email || current.email === email)) return current;
  if (!email || !password) return current;
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function updateCurrentAuthPassword(auth, newPassword) {
  const user = await waitForAuthUser(auth, 3000);
  if (!user) throw new Error('auth-user-missing');
  await updatePassword(user, newPassword);
  return user;
}

export async function requireRole(role, options = {}) {
  const auth = options.auth || getAuth();
  const redirectTo = options.redirectTo || 'login.html';
  const session = getSession(role);
  const user = await waitForAuthUser(auth, options.timeoutMs || 3000);

  if (!session || !session.uid) {
    clearSession(role);
    if (options.redirect !== false) window.location.replace(redirectTo);
    return null;
  }

  // Firebase Auth is browser-global. A customer/admin/rider login in another tab can
  // replace auth.currentUser even though this role's local session is still valid.
  // Keep the role page open and let Firestore rules decide writes that need Auth.
  if (user && user.uid !== session.uid) {
    console.warn(`[MQ Auth] ${role} session kept despite Firebase Auth user mismatch.`);
  }

  return { session, user };
}

export async function secureSignOut(role, auth = getAuth(), redirectTo = 'login.html') {
  clearSession(role);
  try { await signOut(auth); } catch (_) { }
  if (redirectTo) window.location.href = redirectTo;
}
