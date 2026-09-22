import axiosClient from './axiosClient';

export const authApi = {
  login: (payload: any) => {
    return axiosClient.post('/auth/login', payload);
  },
  
  register: (payload: any) => {
    return axiosClient.post('/auth/register', payload);
  },

  googleAuth: (token: string) => {
    return axiosClient.post('/auth/google', { token });
  },

  forgotPassword: (payload: { email: string }) => {
    return axiosClient.post('/auth/forgot-password', payload);
  },

  resetPassword: (payload: any) => {
    return axiosClient.post('/auth/reset-password', payload);
  },

  updateProfile: (payload: any) => {
    return axiosClient.put('/auth/me', payload);
  },

  updatePassword: (payload: any) => {
    return axiosClient.put('/auth/me/password', payload);
  },
};
