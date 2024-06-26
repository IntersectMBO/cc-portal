"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaginationMeta } from "../requests";

interface UsePaginationData {
  data: any[];
  pagination: PaginationMeta;
  isLoading: boolean;
  loadMore: () => Promise<void>;
}

/**
 * Custom hook to manage pagination state and data fetching.
 *
 * @param list - Initial list of data items.
 * @param paginationMeta - Pagination metadata (e.g., current page, item count).
 * @param callbackFetch - Callback function to fetch more data based on params.Should return a promise with data and pagination metadata.
 * @returns An object containing:
 * - data: Current list of data items.
 * - pagination: Current pagination metadata.
 * - isLoading: Loading state indicator.
 * - loadMore: Function to load more data.
 */
export const usePagination = <T>(
  list: T[],
  paginationMeta: PaginationMeta,
  callbackFetch: (
    params: Record<string, string | null>
  ) => Promise<{ data: T[]; meta: PaginationMeta }>
): UsePaginationData => {
  const [data, setData] = useState<T[]>(list);
  const [pagination, setPagination] = useState<PaginationMeta>(paginationMeta);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      ("use server");
      const newData = await callbackFetch({
        page: (pagination.page + 1).toString(),
        search: searchParams.get("search"),
      });
      if (newData.data.length > 0) {
        updateState({
          list: [...data, ...newData.data],
          paginationMeta: newData.meta,
        });
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateState = ({ list, paginationMeta }) => {
    setData(list);
    setPagination(paginationMeta);
  };

  useEffect(() => {
    updateState({ list, paginationMeta });
  }, [searchParams]);

  return {
    data,
    pagination,
    isLoading,
    loadMore,
  };
};
