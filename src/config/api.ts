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
    },
    FRIENDS: {
      LIST: '/friends/list',
      ADD: '/friends/add',
      REMOVE: (id: string) => `/friends/remove/${id}`,
      SEARCH: (q: string) => `/friends/search?q=${encodeURIComponent(q)}`,
      STATS: '/friends/stats',
      HEARTBEAT: '/friends/heartbeat'
    }
  }
};

/**
 * Construit une URL complète pour un endpoint
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const GAME_URL = '/games'; // corrigé (proxy gateway)

export function useRuntimeConfig() {
  return { GAME_URL, API: API_CONFIG };
}

export default API_CONFIG;