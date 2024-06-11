import { Dispatch, SetStateAction } from "react";
import { Box, Typography } from "@mui/material";

import { ICONS } from "@consts";
import { theme } from "@/theme";

interface Props {
  filtersOpen?: boolean;
  setFiltersOpen?: Dispatch<SetStateAction<boolean>>;
  chosenFiltersLength?: number;
  sortOpen: boolean;
  setSortOpen: Dispatch<SetStateAction<boolean>>;
  sortingActive: boolean;
  isFiltering?: boolean;
}

export const OrderActionsChip = (props: Props) => {
  const {
    palette: { secondary },
  } = theme;
  const {
    filtersOpen,
    setFiltersOpen = () => {},
    chosenFiltersLength = 0,
    sortOpen,
    setSortOpen,
    sortingActive,
    isFiltering = true,
  } = props;

  return (
    <Box display="flex" width="min-content" alignItems="center" ml="8px">
      {isFiltering && (
        <Box position="relative">
          <img
            data-testid="filters-button"
            alt="filter"
            onClick={() => {
              setSortOpen(false);
              if (isFiltering) {
                setFiltersOpen(!filtersOpen);
              }
            }}
            src={filtersOpen ? ICONS.filterWhite : ICONS.filter}
            style={{
              background: filtersOpen ? secondary.main : "transparent",
              borderRadius: "100%",
              cursor: "pointer",
              padding: "14px",
              overflow: "visible",
              objectFit: "contain",
            }}
          />
          {!filtersOpen && chosenFiltersLength > 0 && (
            <Box
              sx={{
                alignItems: "center",
                background: secondary.main,
                borderRadius: "100%",
                color: "white",
                display: "flex",
                fontSize: "12px",
                height: "16px",
                justifyContent: "center",
                position: "absolute",
                right: "0",
                top: "0",
                width: "16px",
              }}
            >
              <Typography variant="caption" color="#FFFFFF">
                {chosenFiltersLength}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <Box position="relative">
        <img
          alt="sort"
          data-testid="sort-button"
          onClick={() => {
            if (isFiltering) {
              setFiltersOpen(false);
            }
            setSortOpen(!sortOpen);
          }}
          src={sortOpen ? ICONS.sortWhite : ICONS.sort} //todo
          style={{
            background: sortOpen ? secondary.main : "transparent",
            borderRadius: "100%",
            padding: "14px",
            cursor: "pointer",
            objectFit: "contain",
          }}
        />
        {!sortOpen && sortingActive && (
          <Box
            sx={{
              alignItems: "center",
              background: secondary.main,
              borderRadius: "100%",
              color: "white",
              display: "flex",
              fontSize: "12px",
              height: "16px",
              justifyContent: "center",
              position: "absolute",
              right: "0",
              top: "0",
              width: "16px",
            }}
          >
            <img alt="sorting active" src={ICONS.sortActive} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
