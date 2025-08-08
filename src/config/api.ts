/**
 * Configuration des URLs de l'API
 */

export const API_CONFIG = {
  BASE_URL: '/auth',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/register',
      LOGIN: '/login',
      LOGOUT: '/logout',
      MODIFY_CREDENTIALS: '/modify/credentials',
      ENABLE_2FA: '/2fa/enable',
      VERIFY_2FA: '/2fa/verify',
      DISABLE_2FA: '/2fa/disable',
      STATUS_2FA: '/2fa/status',
      GITHUB_LOGIN: '/github',
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