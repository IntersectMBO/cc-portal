import { Dispatch, SetStateAction } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import { useTranslations } from "next-intl";
import { FilterItem } from "./types";

interface Props {
  chosenSorting: string;
  setChosenSorting: Dispatch<SetStateAction<string>>;
  sortOptions: FilterItem[];
}

export const GovernanceActionsSorting = ({
  chosenSorting,
  setChosenSorting,
  sortOptions,
}: Props) => {
  const t = useTranslations();

  return (
    <Box
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
        zIndex: "1",
      }}
    >
      <FormControl>
        <Box display="flex" justifyContent="space-between" px="20px">
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#9792B5" }}>
            {t("Filters.sortBy")}
          </Typography>
          <Box sx={{ cursor: "pointer" }} onClick={() => setChosenSorting("")}>
            <Typography fontSize={14} fontWeight={500} color="primary">
              {t("Filters.clear")}
            </Typography>
          </Box>
        </Box>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={chosenSorting}
          onChange={(e) => {
            setChosenSorting(e.target.value);
          }}
        >
          {sortOptions.map((item) => (
            <FormControlLabel
              sx={[
                {
                  margin: 0,
                  px: "20px",
                  bgcolor:
                    chosenSorting === item.key ? "#FFF0E7" : "transparent",
                },
                { "&:hover": { bgcolor: "#E6EBF7" } },
              ]}
              key={item.key}
              value={item.key}
              control={<Radio data-testid={`${item.key}-radio`} />}
              label={
                <span data-testid={`${item.key}-radio-text`}>{item.label}</span>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
