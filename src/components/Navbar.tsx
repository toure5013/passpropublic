import React from "react";
import { Link } from "react-router-dom";
import { DoorClosed, LockKeyhole, LogIn, LogOut } from "lucide-react";
import Logo from "./Logo";
import useAuthStore from "../store/loginStore";

export default function Navbar() {
  const {  logout, isLoggedIn } =
    useAuthStore();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-12 sm:h-14">
          <Link to="/" className="flex items-center">
            <Logo className="h-6 sm:h-8 w-auto" style={{ minWidth: "160px" }} />
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center">
              <button
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-700 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                onClick={()=>{
                  logout();
                  window.location.reload();
                }}
              >
                <LockKeyhole className="h-5 w-5 mr-2" />
                Deconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                to="/connexion"
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <LogIn className="h-4 w-4" />
                <span> Connexion</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
