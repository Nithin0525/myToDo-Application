// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

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