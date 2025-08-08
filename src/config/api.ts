/**
 * Configuration des URLs de l'API
 */

export const API_CONFIG = {
  BASE_URL: '/auth',
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