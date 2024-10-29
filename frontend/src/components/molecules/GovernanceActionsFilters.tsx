import {
  Box,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Typography
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback } from "react";

import { useTranslations } from "next-intl";
import { FilterItems } from "./types";

interface Props {
  chosenFilters: Record<string, string[]>;
  setChosenFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  filterOptions: Record<string, FilterItems>;
}

export const GovernanceActionsFilters = ({
  chosenFilters,
  setChosenFilters,
  filterOptions
}: Props) => {
  const t = useTranslations();

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
      const { name, checked } = e.target;

      setChosenFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        if (checked) {
          newFilters[key] = [...(newFilters[key] || []), name];
        } else {
          newFilters[key] = (newFilters[key] || []).filter(
            (item) => item !== name
          );
        }
        return newFilters;
      });
    },
    [setChosenFilters]
  );

  return (
    <Box
      key={JSON.stringify(chosenFilters)}
      display="flex"
      flexDirection="column"
      position="absolute"
      top="60px"
      right="0px"
      sx={{
        background: "#FBFBFF",
        boxShadow: "1px 2px 11px 0px #00123D5E",
        borderRadius: "10px",
        padding: "12px 0px",
        width: "auto",
        zIndex: "1"
      }}
    >
      <Box
        sx={{ cursor: "pointer", position: "absolute", right: 20 }}
        onClick={() => setChosenFilters({})}
      >
        <Typography
          fontSize={14}
          fontWeight={500}
          color="primary"
          lineHeight="1.4375rem"
        >
          {t("Filters.clear")}
        </Typography>
      </Box>
      {Object.values(filterOptions).map((filter) => {
        return (
          <Box>
            <FormLabel
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "#9792B5",
                paddingX: "20px"
              }}
            >
              {filter.title}
            </FormLabel>
            {filter.items.map((item) => (
              <Box
                key={item.key}
                paddingX="20px"
                sx={[{ "&:hover": { bgcolor: "#E6EBF7" } }]}
                bgcolor={
                  chosenFilters[filter.key]?.includes(item.key)
                    ? "#FFF0E7"
                    : "transparent"
                }
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      data-testid={`${item.label.replace(/ /g, "")}-checkbox`}
                      onChange={(e) => handleFilterChange(e, filter.key)}
                      name={item.key}
                      checked={chosenFilters[filter.key]?.includes(item.key)}
                    />
                  }
                  label={
                    <Typography fontSize={14} fontWeight={500} data-testid={`${item.label.replace(/ /g, "")}-checkbox-text`}>
                      {item.label}
                    </Typography>
                  }
                />
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};
