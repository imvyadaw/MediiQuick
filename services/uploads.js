import { validateFile } from '../utils/validators.js';

export function validatePrescriptionFile(file) {
  return validateFile(file, {
    maxBytes: 3 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  });
}

export async function fileToBase64(file) {
  const result = validatePrescriptionFile(file);
  if (!result.ok) throw new Error(result.message);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}
