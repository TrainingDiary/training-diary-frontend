import { StateCreator, create } from 'zustand';
import { PersistOptions, persist } from 'zustand/middleware';

export interface User {
  id: string;
  role: 'TRAINEE' | 'TRAINER';
  unreadNotification: boolean;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

type MyState = UserState & {
  setUser: (user: User) => void;
  clearUser: () => void;
};

type MyPersist = (
  config: StateCreator<MyState>,
  options: PersistOptions<MyState>
) => StateCreator<MyState>;

const useUserStore = create<MyState>(
  (persist as MyPersist)(
    set => ({
      user: null,
      setUser: user => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
