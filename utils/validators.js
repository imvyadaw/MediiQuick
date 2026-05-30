export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobileIndia: /^[6-9]\d{9}$/,
  pincodeIndia: /^\d{6}$/,
  strongPassword: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
  upi: /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/
};

export function isValidEmail(value) {
  return patterns.email.test(String(value || '').trim().toLowerCase());
}

export function isValidMobile(value) {
  return patterns.mobileIndia.test(String(value || '').trim());
}

export function isValidPincode(value) {
  return patterns.pincodeIndia.test(String(value || '').trim());
}

export function isStrongPassword(value) {
  return patterns.strongPassword.test(String(value || ''));
}

export function isValidUpi(value) {
  return patterns.upi.test(String(value || '').trim());
}

export function validateFile(file, options = {}) {
  const maxBytes = options.maxBytes || 3 * 1024 * 1024;
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!file) return { ok: false, message: 'File required.' };
  if (!allowedTypes.includes(file.type)) return { ok: false, message: 'Only JPG, PNG, WEBP, or PDF files are allowed.' };
  if (file.size > maxBytes) return { ok: false, message: `File must be under ${Math.round(maxBytes / 1024 / 1024)} MB.` };
  return { ok: true, message: '' };
}

export function validateFields(values, schema) {
  const errors = {};
  for (const [key, rules] of Object.entries(schema)) {
    const value = values[key];
    for (const rule of rules) {
      const result = rule(value, values);
      if (result !== true) {
        errors[key] = result;
        break;
      }
    }
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export const required = label => value => String(value ?? '').trim() ? true : `${label} is required.`;
export const email = label => value => isValidEmail(value) ? true : `${label} must be a valid email.`;
export const mobile = label => value => isValidMobile(value) ? true : `${label} must be a valid 10 digit mobile number.`;
export const pincode = label => value => isValidPincode(value) ? true : `${label} must be a valid 6 digit PIN code.`;
export const minLength = (label, min) => value => String(value ?? '').length >= min ? true : `${label} must be at least ${min} characters.`;
