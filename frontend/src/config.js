// API Configuration
// Hardcoded to ensure it always connects to the deployed backend
const API_BASE_URL = 'https://mytodo-application.onrender.com';

export const API_CONFIG = {
  BASE_URL: `${API_BASE_URL}/api`,
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    TODOS: '/todos',
    ADMIN_STATS: '/admin/stats',
    ADMIN_USERS: '/admin/users'
  }
};

export default API_CONFIG; 