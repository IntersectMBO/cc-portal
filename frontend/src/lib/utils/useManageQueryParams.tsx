"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Custom hook to manage query parameters in the URL.
 *
 * This hook provides a function to update query parameters in the URL,
 * which can be used for searching, sorting, filtering, etc.
 *
 * @returns {object} - An object containing the updateQueryParams function.
 */
export const useManageQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Updates the query parameters in the URL.
   *
   * This function takes an object representing the parameters to be updated,
   * where each key corresponds to a parameter name and each value is the new value
   * for that parameter. If a value is null, the parameter is removed from the URL.
   *
   * @param {Record<string, string | null>} params - An object where each key is a parameter name and each value is the new value or null to remove the parameter.
   */
  const updateQueryParams = useCallback(
    (params: Record<string, string | null>) => {
      const urlSearchParams = new URLSearchParams(searchParams.toString());

      Object.keys(params).forEach((key) => {
        if (params[key] !== null) {
          urlSearchParams.set(key, params[key]!);
        } else {
          urlSearchParams.delete(key);
        }
      });

      router.push(`${pathname}?${urlSearchParams.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return { updateQueryParams };
};
