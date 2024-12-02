import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Heart, LogIn, LogOut, Ticket, User } from "lucide-react";
import Logo from "./Logo";
import useAuthStore from "../store/loginStore";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const { logout, isLoggedIn, userInfo } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-12 sm:h-14">
            {userInfo ? (
              <Link
                to={
                  userInfo.type == "promoter" ||
                  userInfo.type == "admin" ||
                  userInfo.type == "event_manager"
                    ? "/espace-promoteur"
                    : "/"
                }
                className="flex items-center"
              >
                <Logo
                  className="h-6 sm:h-8 w-auto"
                  style={{ minWidth: "160px" }}
                />
              </Link>
            ) : (
              <Link to="/" className="flex items-center">
                <Logo
                  className="h-6 sm:h-8 w-auto"
                  style={{ minWidth: "160px" }}
                />
              </Link>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User className="h-4 w-4" />
                    <span>{userInfo.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border"
                      >
                        {userInfo?.type == "promoter" ||
                          userInfo?.type == "admin" ||
                          (userInfo?.type == "event_manager" && (
                            <Link
                              to="/espace-promoteur"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setShowDropdown(false)}
                            >
                              <User className="h-4 w-4" />
                              Espace promoteur
                            </Link>
                          ))}

                        {userInfo?.type == "promoter" ||
                        userInfo?.type == "admin" ||
                        userInfo?.type == "event_manager" ? null : (
                          <>
                            <Link
                              to="/tickets"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setShowDropdown(false)}
                            >
                              <Ticket className="h-4 w-4" />
                              Mes tickets
                            </Link>
                            <Link
                              to="/wishlist"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setShowDropdown(false)}
                            >
                              <Heart className="h-4 w-4" />
                              Favoris
                            </Link>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link
                to="/connexion"
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <LogIn className="h-4 w-4" />
                <span>Connexion</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
