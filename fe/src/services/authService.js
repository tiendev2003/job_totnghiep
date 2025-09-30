import apiClient from './apiClient';

const authService = {
  // Login
  login: async (email, password) => {
    return await apiClient.post('/auth/login', { email, password });
  },

  // Register
  register: async (userData) => {
    return await apiClient.post('/auth/register', userData);
  },

  // Logout
  logout: async () => {
    return await apiClient.post('/auth/logout');
  },

  // Forgot Password
  forgotPassword: async (email) => {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    return await apiClient.post('/auth/reset-password', { token, newPassword });
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    return await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Verify Email
  verifyEmail: async (token) => {
    return await apiClient.post('/auth/verify-email', { token });
  },

  // Resend Verification Email
  resendVerificationEmail: async (email) => {
    return await apiClient.post('/auth/resend-verification', { email });
  },

  // Get Current User
  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },

  // Update Profile
  updateProfile: async (profileData) => {
    return await apiClient.put('/auth/profile', profileData);
  },
};

export default authService;
