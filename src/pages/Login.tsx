import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
} from "lucide-react";
import useAuthStore from "../store/loginStore";
import UserService from "../providers/userServices";
import { Link, useNavigate, useParams } from "react-router-dom";
import promoterUserService from "../providers/promoters/promoterUserService";
import { toast } from "react-toastify";
import PhoneInput from "../components/PhoneInput";
import CodeInput from "../components/CodeInput";

type UserType = "public" | "promoter";

export default function Login() {
  const [userType, setUserType] = useState<UserType>("public");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login, updateUserInfo, isLoggedIn, userInfo } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentTimer, setOtpSentTimer] = useState(0);

  const [redirectPath, setRedirectPath] = useState("/home");

  const navigate = useNavigate();

  function getQueryVariable(variable: string) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  useEffect(() => {
    const route_from = getQueryVariable("route_from");

    if (!isLoggedIn) {
      const redirect_path = `/${route_from ? route_from : "home"}`;
      console.log("redirect_path --", redirect_path);
      setRedirectPath(redirect_path);
    }

    console.log("isLoggedIn value:", isLoggedIn); // Debugging
    if (isLoggedIn && userInfo.userType === "public") {
      navigate(`/${route_from ? route_from : "home"}`);
    } else if (isLoggedIn && userInfo.userType === "promoter") {
      navigate("/espace-promoteur");
    }
  }, []);

  useEffect(() => {
    const route_from = getQueryVariable("route_from");

    console.log("isLoggedIn value:", isLoggedIn); // Debugging
    if (isLoggedIn && userInfo.userType === "public") {
      const redirect_path = `/${route_from ? route_from : "home"}`;
      console.log("redirect_path --", redirect_path);
      setRedirectPath(redirect_path);
    } else if (isLoggedIn && userInfo.userType === "promoter") {
      navigate("/espace-promoteur");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (otpSentTimer > 0) {
      console.log(otpSentTimer);

      const otpInterval = setInterval(() => {
        setOtpSentTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(otpInterval); // Clear the interval on unmount
    }
  }, [otpSentTimer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      const response: any = await UserService.register({
        tel: phone,
        name: "user",
        surname: "user",
      });

      if (response.success) {
        toast.success(response.message);
        setError("");
        setOtpSent(true);
        setOtpSentTimer(60);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(
        error.message
          ? error.message
          : "Une erreur s'est produite. Veuillez recommencer."
      );
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const loginPublic = async () => {
    const enteredCode = code.join("");
    if (!enteredCode || enteredCode.length !== 6) {
      // setError("Veuillez entrer le code complet");
      return;
    }

    const response: any = await UserService.login({
      login: phone,
      password: enteredCode,
    });

    console.log(phone, password, userType);

    if (response && response.user) {
      const userInfo = response.user;
      userInfo.userType = "public";

      // Store user data in localStorage
      localStorage.setItem("user_tel", userInfo.tel);
      localStorage.setItem("user_uuid", userInfo.uuid);
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      localStorage.setItem("type", userInfo.type);
      localStorage.setItem("userType", userInfo.userType);

      // update state
      updateUserInfo(userInfo);
      login();

      // Navigate based on user status
      toast.success(response["message"]);

      console.log("redirectPath ========", redirectPath);
      
      window.location.href = redirectPath;

      // navigate(redirectPath);
    } else {
      console.log("response");
      console.log(response["message"]);
      toast.error(response["message"]);
    }
  };

  const loginPromoter = async () => {
    if (!password) {
      setError("Veuillez entrer votre mot de passe");
      return;
    }
    const response: any = await promoterUserService.login({
      username: phone,
      password: password,
    });

    console.log(response);

    if (response.status === 200) {
      const userInfo = response.data;
      if (!userInfo || !userInfo.success) {
        toast.error("Erreur de connexion. Veuillez réessayer.");
        return;
      }
      if (userInfo.status === -1) {
        toast.error(
          "Vous n'avez pas encore d'accès. Veuillez contacter l'administrateur."
        );
        return;
      }

      userInfo.userType = "promoter";

      // Store user data in localStorage
      localStorage.setItem("user_tel", userInfo.tel);
      localStorage.setItem("user_uuid", userInfo.uuid);
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      localStorage.setItem("type", userInfo.type);
      localStorage.setItem("userType", userInfo.userType);

      updateUserInfo(userInfo);
      login();

      // Navigate based on user status
      navigate("/espace-promoteur");
    } else {
      toast.error("Erreur de connexion. Veuillez réessayer.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate phone number
    if (phone.length !== 10) {
      alert("Veuillez entrer un numéro de téléphone valide");
      return;
    }

    try {
      // Assuming login is a function that accepts phoneNumber and password, and returns user info
      if (userType == "promoter") {
        loginPromoter();
        setIsLoading(false);
      } else {
        loginPublic();
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Erreur de connexion. Veuillez réessayer.");
      setIsLoading(false);
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
              onClick={() => setUserType("public")}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                userType === "public"
                  ? "bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                <span>Utilisateur</span>
              </div>
            </button>
            <button
              onClick={() => setUserType("promoter")}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                userType === "promoter"
                  ? "bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <PhoneInput
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  setError("");
                }}
                error={error}
                required
              />
            </div>

            {userType === "promoter" ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <Link
                    to="/mot-de-passe-oublie"
                    className="text-sm text-brand-red hover:text-brand-red/80"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-base"
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
            ) : !otpSent ? null : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code à 6 chiffres
                  </label>
                  <CodeInput
                    value={code}
                    onChange={handleCodeChange}
                    onKeyDown={handleCodeKeyDown}
                    error={error}
                  />

                  {otpSent && otpSentTimer > 0 ? (
                    <p>Renvoyer le code dans {otpSentTimer} seconde(s)</p>
                  ) : (
                    <button
                      onClick={() => handleSendOtp()}
                      className="text-sm text-brand-red hover:text-brand-red/80"
                    >
                      Renvoyer le code
                    </button>
                  )}
                </div>
              </>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                {error}
              </motion.p>
            )}

            {userType === "promoter" && (
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Se souvenir de moi
                  </span>
                </label>
              </div>
            )}

            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                <Loader color="#FF8A00" />
              </div>
            ) : !otpSent && userType === "public" ? (
              <button
                onClick={() => handleSendOtp()}
                className="w-full py-3 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Recevoir le code de confirmation
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Se connecter
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {userType === "promoter" ? (
                <p>
                  Vous n'avez pas de compte ?{" "}
                  <Link
                    to="/devenir-promoteur"
                    className="text-brand-red hover:text-brand-red/80 font-medium"
                  >
                    Devenir promoteur
                  </Link>
                </p>
              ) : null}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
