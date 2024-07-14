import { iAdmin } from '@/types/user/iAdmin';
import { create } from 'zustand';

type State = {
  local: string;
  access_token: string;
  user: iAdmin;
};

type Actions = {
  setCredentials: (user: iAdmin, access_token: string) => void;
  LogOut: () => void;
  setLocal: (value: string) => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
  local: '',
  access_token: '',
  user: {},
  setCredentials: (user: iAdmin, access_token: string) => {
    set({ access_token, user });
  },
  LogOut: () => {
    set({ access_token: '', user: {} });
  },
  setLocal: (local: string) => {
    set({ local });
  },
}));
