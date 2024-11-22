import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Step = 'phone' | 'otp' | 'password';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    if (value.length <= 2) return value;
    if (value.length <= 5) return `${value.slice(0, 2)} ${value.slice(2)}`;
    if (value.length <= 7) return `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
    return `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 7)} ${value.slice(7)}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    // TODO: Send OTP to phone number
    setStep('otp');
  };

  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      alert('Veuillez entrer le code complet');
      return;
    }
    // TODO: Verify OTP
    setStep('password');
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    // TODO: Update password
    navigate('/connexion');
  };

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <button
            onClick={() => step === 'phone' ? navigate('/connexion') : setStep(step === 'otp' ? 'phone' : 'otp')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>

          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {step === 'phone' && 'Mot de passe oublié'}
            {step === 'otp' && 'Vérification OTP'}
            {step === 'password' && 'Nouveau mot de passe'}
          </h1>

          {step === 'phone' && (
            <form onSubmit={handleSubmitPhone} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="ml-2 text-gray-500">+225</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={formatPhoneNumber(phone)}
                    onChange={handlePhoneChange}
                    className="w-full pl-24 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    placeholder="07 00 00 00 00"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Format: 07 XX XX XX XX
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Envoyer le code
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <p className="text-sm text-gray-600 text-center mb-6">
                Un code de vérification a été envoyé au<br />
                <span className="font-medium text-gray-900">+225 {formatPhoneNumber(phone)}</span>
              </p>

              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Vérifier
              </button>

              <p className="text-center text-sm">
                <button type="button" className="text-brand-red hover:text-brand-red/80">
                  Renvoyer le code
                </button>
              </p>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Réinitialiser le mot de passe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}