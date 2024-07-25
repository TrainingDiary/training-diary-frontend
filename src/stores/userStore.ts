import { create } from 'zustand';

export interface User {
  id: string;
  role: 'TRAINEE' | 'TRAINER';
  unreadNotification: boolean;
}

interface UserState {
  user: User | null;
  setUser: (user: any) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
