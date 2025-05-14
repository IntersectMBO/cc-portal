"use client";

import { CC_MEMBERS_SORTING } from "@consts";
import { useManageQueryParams } from "@hooks";
import { DataActionsBar } from "@molecules";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export function DataActionsContainer({
  setSearchText,
  setChosenSorting,
  searchLabel,
}: {
  setSearchText: (text: string) => void;
  setChosenSorting: (sorting: string) => void;
  searchLabel?: string;
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [chosenSorting, localSetChosenSorting] = useState<string>("");
  const { updateQueryParams } = useManageQueryParams();

  const closeSorts = useCallback(() => {
    setSortOpen(false);
  }, []);

  const handleSortingChange = (sorting: string) => {
    localSetChosenSorting(sorting);
    setChosenSorting(sorting);
  };

  useEffect(() => {
    updateQueryParams({ sortBy: chosenSorting || null });
  }, [chosenSorting, updateQueryParams]);

  return (
    <Box display="flex" sx={{ position: "relative" }}>
      <DataActionsBar
        isFiltering={false}
        chosenSorting={chosenSorting}
        closeSorts={closeSorts}
        setChosenSorting={handleSortingChange}
        setSearchText={setSearchText}
        setSortOpen={setSortOpen}
        sortingActive={Boolean(chosenSorting)}
        sortOpen={sortOpen}
        sortOptions={CC_MEMBERS_SORTING}
        searchLabel={searchLabel}
      />
    </Box>
  );
}
