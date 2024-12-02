import React, { useState } from 'react';
import { Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validatePhoneNumber, cleanPhoneNumber } from '../utils/phoneValidation';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function PhoneInput({ 
  value, 
  onChange, 
  error: externalError, 
  required = false,
  onValidationChange 
}: PhoneInputProps) {
  const [internalError, setInternalError] = useState<string>('');
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.length <= 10) {
      onChange(rawValue);
      
      if (isTouched) {
        validateInput(rawValue);
      }
    }
  };

  const validateInput = (phoneNumber: string) => {
    const result = validatePhoneNumber(phoneNumber);
    setInternalError(result.error || '');
    if (onValidationChange) {
      onValidationChange(result.isValid);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    validateInput(cleanPhoneNumber(value));
  };

  const error = externalError || internalError;
  const showError = isTouched && error;
  const showSuccess = isTouched && cleanPhoneNumber(value).length === 10 && !error;

  return (
    <div>
      <div className="relative flex">
        <div className={`flex items-center bg-gray-50 border border-r-0 rounded-l-lg px-3 transition-colors ${
          showError ? 'border-red-300 bg-red-50' :
          showSuccess ? 'border-green-300 bg-green-50' :
          'border-gray-200'
        }`}>
          <Phone className={`h-4 w-4 mr-2 ${
            showError ? 'text-red-400' :
            showSuccess ? 'text-green-500' :
            'text-gray-400'
          }`} />
          <span className={`font-medium ${
            showError ? 'text-red-500' :
            showSuccess ? 'text-green-600' :
            'text-gray-500'
          }`}>+225</span>
        </div>
        <div className="relative flex-1">
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full pl-3 pr-10 py-2 border rounded-r-lg focus:ring-2 transition-colors ${
              showError 
                ? 'border-red-300 focus:ring-red-100 focus:border-red-500' 
                : showSuccess
                ? 'border-green-300 focus:ring-green-100 focus:border-green-500'
                : 'border-gray-200 focus:ring-brand-red/20 focus:border-brand-red'
            }`}
            required={required}
            placeholder="Numéro de téléphone"
            maxLength={10}
          />
          <AnimatePresence>
            {(showError || showSuccess) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showError ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}