import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import useAuthStore from '../store/loginStore';

type UserType = 'public' | 'promoter';

export default function Login() {
  const [userType, setUserType] = useState<UserType>('public');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login,updateUserInfo } = useAuthStore();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate phone number
    if (phone.length !== 10) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    console.log('Login attempt:', { userType, phone, password });

    //call the api to login user
    /**
     *"id": 170,
        "uuid": "8aefa9c5-7ad6-429f-915e-c7f962b7be6b",
        "name": "PATERNE",
        "surname": "paterne",
        "tel": "0777372714",
        "birth_date": "1988-09-20",
        "district_id": 1,
        "login": "0777372714",
        "sponsoring_code": "N4FKL5",
        "mail": null,
        "count_profile_modification": 1,
        "device_token": "dgnL2g5iSfu_FVaj7J7s-P:APA91bE-IGTLN2qcI7w4sJFURCImXUYXBVwWYXvx9JM4-dbOjHFNuAinnYbLzM5A4UMpCSFBy9gir_irolXgFcKJhUrJCRBl0kwb57iOk0KbTnzQ0zhdPXAJCtuk3s-yUDXUWOa5HhG4",
        "account_removed": 1,
        "removed_at": null,
        "status": 1,
        "created_at": "2022-09-07T11:12:46.000000Z",
        "updated_at": "2023-06-10T09:51:27.000000Z",
        "solde": 99166030,
        "wallet": {
            "id": 10,
            "balance": 99166030,
            "balance_bonus": 8800,
            "user_public_id": 170,
            "created_at": "2022-09-07T11:12:46.000000Z",
            "updated_at": "2024-11-01T14:16:54.000000Z"
        }
     */
    let userInfo:any = {}
    updateUserInfo({id : userInfo.id, uuid : userInfo.uuid, name : userInfo.name, surname : userInfo.surname,})
    login()
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