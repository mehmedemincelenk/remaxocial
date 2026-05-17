import { useAppContext } from '../context/AppContext';

/**
 * useAuth - Global Context üzerinden oturum bilgilerine erişir.
 * Mevcut bileşenlerin bozulmaması için eski arayüzü korur.
 */
export default function useAuth() {
  const { user, loading, isAuthenticated, logout } = useAppContext();
  
  return { 
    session: user ? { user } : null, 
    user, 
    loading, 
    isAuthenticated,
    logout
  };
}
