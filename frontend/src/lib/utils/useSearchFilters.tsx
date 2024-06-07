"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useSearchFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchParams = useCallback(
    (params: Record<string, string | null>) => {
      const urlSearchParams = new URLSearchParams(searchParams.toString());

      Object.keys(params).forEach((key) => {
        if (params[key] !== null) {
          urlSearchParams.set(key, params[key]!); // Use non-null assertion
        } else {
          urlSearchParams.delete(key);
        }
      });

      router.push(`${pathname}?${urlSearchParams.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return { updateSearchParams };
};
