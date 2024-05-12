import { create } from 'zustand';

type Pagination = {
  page: number;
  limit: number;
};

type Filters = Record<string, any>;
type Sorter = Record<string, any>;

type State = {
  pagination: Pagination;
  totalCount: number;
  filters: Filters;
  sorters: Sorter;
};

type Actions = {
  setTableParams: (newParams: Partial<State>) => void;
};

export const useTableParamsStore = create<State & Actions>((set) => ({
  pagination: {
    page: 1,
    limit: 10,
  },
  totalCount: 0,
  filters: {},
  sorters: {},
  setTableParams: (newParams) =>
    set((state) => ({
      ...state,
      ...newParams,
    })),
}));
