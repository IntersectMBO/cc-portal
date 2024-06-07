import { Dispatch, FC, SetStateAction } from "react";
import { Box } from "@mui/material";
import { Search } from "@molecules";

import { GovernanceActionsFilters, GovernanceActionsSorting } from "@molecules";
import { ClickOutside } from "@atoms";

import { OrderActionsChip } from "./OrderActionsChip";

type DataActionsBarProps = {
  chosenFilters?: Record<string, string[];
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
  } = props;

  return (
    <>
      <Box alignItems="center" display="flex" justifyContent="flex-start">
        <Search setSearchText={setSearchText} />
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
          />
        </ClickOutside>
      )}
      {sortOpen && (
        <ClickOutside onClick={closeSorts}>
          <GovernanceActionsSorting
            chosenSorting={chosenSorting}
            setChosenSorting={setChosenSorting}
          />
        </ClickOutside>
      )}
    </>
  );
};
