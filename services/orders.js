import { callFunction } from './firebase.js';
import { validateFields, required } from '../utils/validators.js';

const updateOrderStatusFn = callFunction('updateOrderStatus');
const adminActionFn = callFunction('adminAction');

export const ORDER_STATUSES = Object.freeze(['pending', 'confirmed', 'packing', 'on_the_way', 'delivered', 'cancelled']);

export function canTransitionOrder(from, to) {
  const map = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['packing', 'cancelled'],
    packing: ['on_the_way', 'cancelled'],
    on_the_way: ['delivered'],
    delivered: [],
    cancelled: []
  };
  return (map[from] || []).includes(to);
}

export async function updateOrderStatus(orderId, status, extra = {}) {
  const validation = validateFields({ orderId, status }, {
    orderId: [required('Order ID')],
    status: [value => ORDER_STATUSES.includes(value) ? true : 'Invalid order status.']
  });
  if (!validation.ok) throw Object.assign(new Error('Invalid order update'), { errors: validation.errors });
  return updateOrderStatusFn({ orderId, status, extra });
}

export async function runAdminAction(action, payload = {}) {
  return adminActionFn({ action, payload });
}
