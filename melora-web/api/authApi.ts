import axiosClient from './axiosClient';

export const authApi = {
  login: (payload: any) => {
    return axiosClient.post('/login', payload);
  },
  
  register: (payload: any) => {
    return axiosClient.post('/register', payload);
  },

  googleAuth: (token: string) => {
    return axiosClient.post('/auth/google', { token });
  },

};
