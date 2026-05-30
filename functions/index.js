const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
setGlobalOptions({ region: 'asia-south1', maxInstances: 10 });

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

exports.validateSession = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Login required.');
  const uid = request.auth.uid;
  const expectedRole = String(request.data?.role || '').trim();
  const [userSnap, adminSnap, riderSnap] = await Promise.all([
    db.collection('users').doc(uid).get(),
    db.collection('admins').where('uid', '==', uid).limit(1).get(),
    db.collection('riders').where('uid', '==', uid).limit(1).get()
  ]);
  let profile = null;
  if (!adminSnap.empty) profile = { role: 'admin', id: adminSnap.docs[0].id, data: adminSnap.docs[0].data() };
  else if (!riderSnap.empty) profile = { role: 'rider', id: riderSnap.docs[0].id, data: riderSnap.docs[0].data() };
  else if (userSnap.exists) profile = { role: 'customer', id: userSnap.id, data: userSnap.data() };
  if (!profile) throw new HttpsError('permission-denied', 'No linked profile found.');
  if (expectedRole && expectedRole !== profile.role) throw new HttpsError('permission-denied', 'Role mismatch.');
  if (request.auth.token.role !== profile.role || request.auth.token.profileId !== profile.id) {
    await admin.auth().setCustomUserClaims(uid, { role: profile.role, profileId: profile.id });
  }
  return { ok: true, role: profile.role, profileId: profile.id, claims: { role: profile.role, profileId: profile.id } };
});

const ORDER_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['packing', 'cancelled'],
  packing: ['on_the_way', 'cancelled'],
  on_the_way: ['delivered'],
  delivered: [],
  cancelled: []
};

function requireRole(request, role) {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Login required.');
  if (request.auth.token.role !== role) throw new HttpsError('permission-denied', `${role} role required.`);
  return request.auth;
}

function audit(auth, action, payload) {
  return db.collection('auditLogs').add({
    action,
    actorUid: auth.uid,
    actorRole: auth.token.role || null,
    payload: payload || {},
    createdAt: FieldValue.serverTimestamp()
  });
}

function cleanId(value, label) {
  const id = String(value || '').trim();
  if (!/^[A-Za-z0-9_.:-]{3,160}$/.test(id)) throw new HttpsError('invalid-argument', `${label} is invalid.`);
  return id;
}

exports.updateOrderStatus = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Login required.');
  const auth = request.auth;
  const orderId = cleanId(request.data?.orderId, 'Order ID');
  const status = String(request.data?.status || '').trim();
  if (!ORDER_TRANSITIONS[status]) throw new HttpsError('invalid-argument', 'Invalid order status.');
  const orderRef = db.collection('orders').doc(orderId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) throw new HttpsError('not-found', 'Order not found.');
    const order = snap.data();
    const current = order.status || 'pending';
    if (!(ORDER_TRANSITIONS[current] || []).includes(status)) throw new HttpsError('failed-precondition', `Cannot move ${current} to ${status}.`);
    const isAdmin = auth.token.role === 'admin' && [order.adminUid, order.pharmacyUid, order.assignedAdminUid].includes(auth.uid);
    const isRider = auth.token.role === 'rider' && [order.riderUid, order.assignedRiderUid].includes(auth.uid);
    const isCustomerCancel = status === 'cancelled' && [order.uid, order.userId, order.customerUid].includes(auth.uid);
    if (!isAdmin && !isRider && !isCustomerCancel) throw new HttpsError('permission-denied', 'Not allowed for this order.');
    tx.update(orderRef, { status, statusUpdatedAt: FieldValue.serverTimestamp(), statusUpdatedBy: auth.uid });
  });
  await audit(auth, 'order.status.update', { orderId, status });
  return { ok: true, orderId, status };
});

exports.requestPayout = onCall(async (request) => {
  const auth = requireRole(request, 'rider');
  const amount = Number(request.data?.amount);
  const upiId = String(request.data?.upiId || '').trim();
  if (!Number.isFinite(amount) || amount < 100 || amount > 100000) throw new HttpsError('invalid-argument', 'Invalid payout amount.');
  if (!/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) throw new HttpsError('invalid-argument', 'Invalid UPI ID.');
  const riderSnap = await db.collection('riders').where('uid', '==', auth.uid).limit(1).get();
  if (riderSnap.empty) throw new HttpsError('permission-denied', 'Rider profile missing.');
  const payoutRef = await db.collection('withdrawalRequests').add({
    uid: auth.uid,
    riderId: riderSnap.docs[0].id,
    amount: Math.round(amount * 100) / 100,
    upiId,
    status: 'pending',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  await audit(auth, 'payout.request', { payoutId: payoutRef.id, amount });
  return { ok: true, payoutId: payoutRef.id };
});

exports.approvePayout = onCall(async (request) => {
  const auth = requireRole(request, 'admin');
  const payoutId = cleanId(request.data?.payoutId, 'Payout ID');
  const decision = String(request.data?.decision || '').trim();
  if (!['approved', 'rejected', 'completed'].includes(decision)) throw new HttpsError('invalid-argument', 'Invalid payout decision.');
  await db.collection('withdrawalRequests').doc(payoutId).update({ status: decision, reviewedBy: auth.uid, updatedAt: FieldValue.serverTimestamp() });
  await audit(auth, 'payout.review', { payoutId, decision });
  return { ok: true, payoutId, decision };
});

exports.adminAction = onCall(async (request) => {
  const auth = requireRole(request, 'admin');
  const action = String(request.data?.action || '').trim();
  const payload = request.data?.payload && typeof request.data.payload === 'object' ? request.data.payload : {};
  const allowed = ['medicine.create', 'medicine.update', 'medicine.delete', 'rider.assign', 'rider.unassign', 'profile.update'];
  if (!allowed.includes(action)) throw new HttpsError('invalid-argument', 'Unsupported admin action.');
  await audit(auth, `admin.${action}`, payload);
  return { ok: true, action };
});

exports.setUserRole = onCall(async (request) => {
  requireRole(request, 'admin');
  const uid = cleanId(request.data?.uid, 'UID');
  const role = String(request.data?.role || '').trim();
  if (!['customer', 'admin', 'rider'].includes(role)) throw new HttpsError('invalid-argument', 'Invalid role.');
  await admin.auth().setCustomUserClaims(uid, { role });
  return { ok: true, uid, role };
});
