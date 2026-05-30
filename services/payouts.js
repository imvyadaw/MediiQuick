import { callFunction } from './firebase.js';
import { validateFields, required, isValidUpi } from '../utils/validators.js';

const requestPayoutFn = callFunction('requestPayout');
const approvePayoutFn = callFunction('approvePayout');

export async function requestPayout(amount, upiId) {
  const validation = validateFields({ amount, upiId }, {
    amount: [value => Number(value) >= 100 ? true : 'Minimum payout is 100.'],
    upiId: [required('UPI ID'), value => isValidUpi(value) ? true : 'Enter a valid UPI ID.']
  });
  if (!validation.ok) throw Object.assign(new Error('Invalid payout request'), { errors: validation.errors });
  return requestPayoutFn({ amount: Number(amount), upiId: String(upiId).trim() });
}

export async function approvePayout(payoutId, decision) {
  return approvePayoutFn({ payoutId, decision });
}
