"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaginationMeta, ResponseErrorI } from "../requests";

interface UsePaginationData {
  data: any[];
  pagination: PaginationMeta;
  isLoading: boolean;
  loadMore: () => Promise<void>;
}

interface FetchMoreDataResponseI<T> extends ResponseErrorI {
  data?: T[];
  meta?: PaginationMeta;
}

/**
 * Custom hook to manage pagination state and data fetching.
 *
 * @param list - Initial list of data items.
 * @param paginationMeta - Pagination metadata (e.g., current page, item count).
 * @param callbackFetch - Callback function to fetch more data.Should return a promise with data and pagination metadata.
 * @returns An object containing:
 * - data: Current list of data items.
 * - pagination: Current pagination metadata.
 * - isLoading: Loading state indicator.
 * - loadMore: Function to load more data.
 */
export const usePagination = <T>(
  list: T[],
  paginationMeta: PaginationMeta,
  callbackFetch: (page: number) => Promise<FetchMoreDataResponseI<T>>
): UsePaginationData => {
  const [data, setData] = useState<T[]>(list);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationMeta>(paginationMeta);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      ("use server");
      const newData = await callbackFetch(page + 1);
      if (newData?.error) {
        router.refresh();
      }
      if (newData?.data.length > 0) {
        updateState({
          list: [...data, ...newData.data],
          paginationMeta: newData.meta,
          page: page + 1,
        });
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateState = ({ list, paginationMeta, page }) => {
    setData(list);
    setPagination(paginationMeta);
    setPage(page);
  };

  useEffect(() => {
    // Reset page when new query param is applied
    updateState({ list, paginationMeta, page: 1 });
  }, [searchParams]);

  return {
    data,
    pagination,
    isLoading,
    loadMore,
  };
};
