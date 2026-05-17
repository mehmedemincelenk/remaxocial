import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { checkWhitelist, deriveMemberId } from '../utils/auth';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message, type }

  const notify = (message, type = 'info') => {
    if (!message) {
      setToast(null);
      return;
    }
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const initUser = async (authUser) => {
    if (!authUser) {
      setUser(null);
      setMemberData(null);
      setMemberId(null);
      setLoading(false);
      return;
    }

    setUser(authUser);
    const { member } = await checkWhitelist(authUser.email);
    const mId = deriveMemberId(authUser, member);
    
    setMemberData(member);
    setMemberId(mId);
    setLoading(false);
  };

  useEffect(() => {
    // 1. Mevcut oturumu al
    supabase.auth.getSession().then(({ data: { session } }) => {
      initUser(session?.user || null);
    });

    // 2. Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      initUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // For developer quick-login bypass (fully tree-shakable in production builds)
  useEffect(() => {
    if (import.meta.env.DEV) {
      const handleDevLogin = () => {
        const mockUser = { id: 'dev-user-id', email: 'dev@remaxocial.com' };
        setUser(mockUser);
        setMemberData({ id: 'dev-member-id', email: 'dev@remaxocial.com', role: 'admin', full_name: 'Developer Bypass' });
        setMemberId('dev-member-id');
        setLoading(false);
      };
      
      const handleDevLogout = () => {
        setUser(null);
        setMemberData(null);
        setMemberId(null);
        setLoading(false);
      };

      window.addEventListener('dev-login-bypass', handleDevLogin);
      window.addEventListener('dev-logout-bypass', handleDevLogout);
      return () => {
        window.removeEventListener('dev-login-bypass', handleDevLogin);
        window.removeEventListener('dev-logout-bypass', handleDevLogout);
      };
    }
  }, []);

  const value = {
    user,
    memberData,
    memberId,
    loading,
    toast,
    notify,
    isAuthenticated: !!user,
    isAdmin: memberData?.role === 'admin',
    logout: () => supabase.auth.signOut()
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
