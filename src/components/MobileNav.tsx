import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Ticket } from "lucide-react";
import useAuthStore from "../store/loginStore";

export default function MobileNav() {
  const { userInfo } = useAuthStore();

  const location = useLocation();

  return (
    <>
      {userInfo?.type == "promoter" ||
      userInfo?.type == "admin" ||
      userInfo?.type == "event_manager" ? null : (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
            <Link
              to="/"
              className={`flex flex-col items-center space-y-1 px-3 ${
                location.pathname === "/" ? "text-brand-red" : "text-gray-600"
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-[10px] sm:text-xs">Accueil</span>
            </Link>
            <Link
              to="/panier"
              className={`flex flex-col items-center space-y-1 px-3 ${
                location.pathname === "/panier"
                  ? "text-brand-red"
                  : "text-gray-600"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-[10px] sm:text-xs">Panier</span>
            </Link>
            <Link
              to="/tickets"
              className={`flex flex-col items-center space-y-1 px-3 ${
                location.pathname === "/tickets"
                  ? "text-brand-red"
                  : "text-gray-600"
              }`}
            >
              <Ticket className="h-5 w-5" />
              <span className="text-[10px] sm:text-xs">Mes tickets</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
