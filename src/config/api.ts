/**
 * Configuration des URLs de l'API
 */

// Détecte automatiquement le protocole et l'host
const getBaseUrl = (): string => {
    // if (typeof window !== 'undefined') {
    //   // Côté client : utilise le même protocole que la page courante
    //   return `${window.location.protocol}//${window.location.host}`;
    // }
    
    // Fallback pour le SSR ou les tests
    return 'http://localhost/auth';
  };
  
  const isLocalHost = window.location.hostname === 'localhost'

  export const API_CONFIG = {
    BASE_URL: isLocalHost ? 'http://localhost:3000/auth' : '/auth',
    ENDPOINTS: {
      AUTH: {
        REGISTER: '/register',
        LOGIN: '/login',
        LOGOUT: '/auth/logout',
        VERIFY_2FA: '/auth/2fa/verify',
        SETUP_2FA: '/auth/2fa/setup',
        GITHUB_LOGIN: '/auth/github',
      },
      USER: {
        PROFILE: '/users/profile',
        UPDATE: '/users/update',
      },
      GAME: {
        CREATE: '/games/create',
        JOIN: '/games/join',
        STATS: '/games/stats',
      }
    }
  };
  
  /**
   * Construit une URL complète pour un endpoint
   */
  export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  };
  
  export default API_CONFIG;