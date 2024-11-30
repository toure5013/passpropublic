import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSessionStore } from './store/sessionStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import CheckoutProgress from './components/CheckoutProgress';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import EventBooking from './pages/EventBooking';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import Wishlist from './pages/Wishlist';
import Tickets from './pages/Tickets';
import TicketView from './pages/TicketView';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import BecomePromoterPage from './pages/BecomePromoterPage';
import PromoterDashboard from './pages/PromoterDashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentIframe from './components/Checkout/PaymentIframe';
import PaymentStatus from './components/Checkout/PaymentStatus';

function ScrollToTop() {
  const location = useLocation();
  const updateLastVisit = useSessionStore(state => state.updateLastVisit);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    updateLastVisit();
  }, [location, updateLastVisit]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const showProgress = ['/event', '/panier', '/checkout'].some(path => 
    location.pathname.includes(path)
  );

  let currentStep: 'selection' | 'cart' | 'payment' = 'selection';
  if (location.pathname.includes('/panier')) currentStep = 'cart';
  if (location.pathname.includes('/checkout')) currentStep = 'payment';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] relative">
        <ToastContainer />

      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/images/background-pattern.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 1
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {showProgress && <CheckoutProgress currentStep={currentStep} />}
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/event/:id/booking" element={<EventBooking />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/paiement/init" element={<PaymentIframe />} />
                <Route path="/paiement/status" element={<PaymentStatus />} />
                <Route path="/paiement/succes" element={<PaymentSuccess />} />
                <Route path="/paiement/erreur" element={<PaymentError />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/tickets/:id" element={<TicketView  />} />
                <Route path="/aide" element={<Help />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/conditions" element={<Terms />} />
                <Route path="/confidentialite" element={<Privacy />} />
                <Route path="/devenir-promoteur" element={<BecomePromoterPage />} />
                <Route path="/espace-promoteur" element={<PromoterDashboard />} />
                <Route path="/connexion" element={<Login />} />
                <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />

                <Route path="/*" element={<Home />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </main>

        <Footer />
        <MobileNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}