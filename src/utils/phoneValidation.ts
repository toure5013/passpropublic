export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePhoneNumber(phone: string): PhoneValidationResult {
  const cleanNumber = phone.replace(/\D/g, '');

  if (!cleanNumber) {
    return {
      isValid: false,
      error: 'Le numéro de téléphone est requis'
    };
  }

  if (cleanNumber.length !== 10) {
    return {
      isValid: false,
      error: 'Le numéro doit contenir 10 chiffres'
    };
  }

  return {
    isValid: true
  };
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}