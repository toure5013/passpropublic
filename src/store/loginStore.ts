import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
    isLoggedIn: boolean;
    userInfo: any;
    wallet: any;
    login: () => void;
    logout: () => void;
    updateUserInfo: (userInfo: any) => void;
    updateWallet: (wallet: any) => void;
}
const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            isLoggedIn: false,
            userInfo: null,
            wallet: null,
            login: () => {
                const userLocalStorage = localStorage.getItem('user_uuid');
                const userInfoLocalStorage = localStorage.getItem('user_info');
                const userInfo = userInfoLocalStorage ? JSON.parse(userInfoLocalStorage) : null;
                const walletLocalStorage = localStorage.getItem('user_wallet');
                //check if user is logged in and set the state
                if (userLocalStorage && userInfo !== null) {
                    console.log('loggedin');
                    
                    set({ isLoggedIn: true });
                    set({ userInfo });
                    set({ wallet: walletLocalStorage ? JSON.parse(walletLocalStorage) : null });
                }
            },
            logout: () => {
                set({ isLoggedIn: false });
                localStorage.clear();
            },
            updateUserInfo: (userInfo) => {
                set({ userInfo });
                localStorage.setItem('user_info', JSON.stringify(userInfo));
            },
            updateWallet: (wallet) => {
                set({ wallet });
                localStorage.setItem('user_wallet', JSON.stringify(wallet));
            },
        }),
        {
            name: 'userLoginStatus',
        }
    )
);


export default useAuthStore;