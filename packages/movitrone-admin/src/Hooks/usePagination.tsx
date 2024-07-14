import { useEffect } from 'react';
import { useTableParamsStore } from '@/store/useTableParamsStore';

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
interface UsePagination {
  tableParamsStore: Partial<State>;
  handleTableChange: (
    pagination: any,
    filters: Record<string, any>,
    sorter: Record<string, any>,
  ) => void;
}

const usePagination = (refetch: () => void): UsePagination => {
  const tableParamsStore = useTableParamsStore();

  const handleTableChange = (
    pagination: any,
    filters: Record<string, any>,
    sorter: Record<string, any>,
  ) => {
    tableParamsStore.setTableParams({
      pagination: {
        page: pagination.current,
        limit: pagination.pageSize,
      },
      filters,
      sorters: sorter,
    });
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableParamsStore]);

  return {
    tableParamsStore,
    handleTableChange,
  };
};

export default usePagination;
