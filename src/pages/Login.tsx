import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import useAuthStore from '../store/loginStore';
import UserService from '../providers/userServices';
import { useNavigate } from "react-router-dom";

type UserType = 'public' | 'promoter';

export default function Login() {
  const [userType, setUserType] = useState<UserType>('public');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('0777372714');
  const [password, setPassword] = useState('080208');
  const { login,updateUserInfo } = useAuthStore();

  const navigate = useNavigate();

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    if (phone.length !== 10) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    console.log('Login attempt:', { userType, phone, password });

    try {
      // Assuming login is a function that accepts phoneNumber and password, and returns user info
      const response:any = await UserService.login({ login: phone, password });

      if (response && response.user) {
        const userInfo = response.user;

        // Store user data in localStorage
        localStorage.setItem('user_tel', userInfo.tel);
        localStorage.setItem('user_uuid', userInfo.uuid);
        localStorage.setItem('user_name', userInfo.name);
        localStorage.setItem('user_surname', userInfo.surname);
        localStorage.setItem('user', JSON.stringify(userInfo));

        // Update the auth store with user information
        updateUserInfo({
          id: userInfo.id,
          uuid: userInfo.uuid,
          name: userInfo.name,
          surname: userInfo.surname,
        });

        // update state
        login()
        updateUserInfo(userInfo);

        // Navigate based on user status
        if (userInfo.status === -1) {
          console.log('Redirecting to OTP page...');
          // Replace with actual redirection to OTP page

        } else {
          console.log('Redirecting to home page...');
          // use router to redirect to home
           navigate("/home");
        }
      } else {
        console.error('Login failed. Invalid response.');
        alert('Erreur de connexion. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Connexion à votre compte
          </h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setUserType('public')}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                userType === 'public'
                  ? 'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                <span>Utilisateur</span>
              </div>
            </button>
            <button
              onClick={() => setUserType('promoter')}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                userType === 'promoter'
                  ? 'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Promoteur</span>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-brand-red hover:text-brand-red/80">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              {userType === 'promoter' ? (
                <a href="/devenir-promoteur" className="text-brand-red hover:text-brand-red/80 font-medium">
                  Devenir promoteur
                </a>
              ) : (
                <a href="/inscription" className="text-brand-red hover:text-brand-red/80 font-medium">
                  S'inscrire
                </a>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}