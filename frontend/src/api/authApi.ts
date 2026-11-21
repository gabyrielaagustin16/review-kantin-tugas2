import api from './axiosInstance';

export const authApi = {
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
