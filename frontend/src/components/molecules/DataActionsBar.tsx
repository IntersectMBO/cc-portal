import { Dispatch, FC, SetStateAction } from "react";
import { Box } from "@mui/material";
import { Search } from "@molecules";

import { GovernanceActionsFilters, GovernanceActionsSorting } from "@molecules";
import { ClickOutside } from "@atoms";

import { OrderActionsChip } from "./OrderActionsChip";
import { FilterItem, FilterItems } from "./types";

type DataActionsBarProps = {
  chosenFilters?: Record<string, string[]>;
  chosenFiltersLength?: number;
  chosenSorting: string;
  closeFilters?: () => void;
  closeSorts: () => void;
  filtersOpen?: boolean;
  isFiltering?: boolean;
  setChosenFilters?: Dispatch<SetStateAction<Record<string, string[]>>>;
  setChosenSorting: Dispatch<SetStateAction<string>>;
  setFiltersOpen?: Dispatch<SetStateAction<boolean>>;
  setSearchText: Dispatch<SetStateAction<string>>;
  setSortOpen: Dispatch<SetStateAction<boolean>>;
  sortingActive: boolean;
  sortOpen: boolean;
  sortOptions: FilterItem[];
  filterOptions?: Record<string, FilterItems>;
  searchLabel?: string;
};

export const DataActionsBar: FC<DataActionsBarProps> = ({ ...props }) => {
  const {
    chosenFilters,
    chosenFiltersLength,
    chosenSorting,
    closeFilters = () => {},
    closeSorts,
    filtersOpen,
    isFiltering = true,
    setChosenFilters = () => {},
    setChosenSorting,
    setFiltersOpen,
    setSearchText,
    setSortOpen,
    sortingActive,
    sortOpen,
    sortOptions,
    filterOptions,
    searchLabel,
  } = props;

  return (
    <>
      <Box
        width={{ xxs: "100%", md: "auto" }}
        alignItems="center"
        display="flex"
        justifyContent={{ xxs: "space-between", md: "flex-start" }}
      >
        <Search setSearchText={setSearchText} searchLabel={searchLabel} />
        <OrderActionsChip
          chosenFiltersLength={chosenFiltersLength}
          filtersOpen={filtersOpen}
          isFiltering={isFiltering}
          setFiltersOpen={setFiltersOpen}
          setSortOpen={setSortOpen}
          sortingActive={sortingActive}
          sortOpen={sortOpen}
        />
      </Box>
      {filtersOpen && (
        <ClickOutside onClick={closeFilters}>
          <GovernanceActionsFilters
            chosenFilters={chosenFilters}
            setChosenFilters={setChosenFilters}
            filterOptions={filterOptions}
          />
        </ClickOutside>
      )}
      {sortOpen && (
        <ClickOutside onClick={closeSorts}>
          <GovernanceActionsSorting
            chosenSorting={chosenSorting}
            setChosenSorting={setChosenSorting}
            sortOptions={sortOptions}
          />
        </ClickOutside>
      )}
    </>
  );
};
