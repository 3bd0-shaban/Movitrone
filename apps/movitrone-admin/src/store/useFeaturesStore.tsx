import { create } from 'zustand';
type State = {
  M_Location: boolean;
  sideBar: boolean;
  isEdit: boolean;
  isNew: boolean;
  isModal: boolean;
  keyword: string;
};

type Actions = {
  setM_Location: (value: boolean) => void;
  set_SideBar: (value: boolean) => void;
  set_Modal: (value: boolean) => void;
  setEdit: (value: boolean) => void;
  setNew: (value: boolean) => void;
  setKeyword: (value: string) => void;
};

export const useFeaturesStore = create<State & Actions>((set) => ({
  selectedShipping: null,
  M_Location: false,
  sideBar: false,
  isEdit: false,
  isModal: false,
  isNew: false,
  keyword: '',

  setM_Location: (isM_Location: boolean) => {
    set({ M_Location: isM_Location });
  },
  set_SideBar: (sideBar: boolean) => {
    set({ sideBar: sideBar });
  },
  set_Modal: (isModal: boolean) => {
    set({ isModal: isModal });
  },
  setEdit: (isEdit: boolean) => {
    set({ isEdit: isEdit });
  },
  setNew: (isNew: boolean) => {
    set({ isNew: isNew });
  },
  setKeyword: (keyword: string) => {
    set({ keyword: keyword });
  },
}));
