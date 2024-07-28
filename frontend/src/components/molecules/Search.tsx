"use client";

import { customPalette } from "@consts";
import { useDebounce } from "@hooks";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  setSearchText: (value) => void;
  delay?: number;
}

export const Search = ({ setSearchText, delay = 500 }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, delay);

  useEffect(() => {
    setSearchText(debouncedSearchInput);
  }, [debouncedSearchInput, setSearchText]);

  return (
    <InputBase
      inputProps={{ "data-testid": "search-input" }}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Search..."
      value={searchInput}
      startAdornment={
        <SearchIcon
          style={{
            color: "#99ADDE",
            height: 16,
            marginRight: 4,
            width: 16,
          }}
        />
      }
      sx={{
        bgcolor: "white",
        border: 1,
        borderColor: "secondaryBlue",
        borderRadius: 50,
        boxShadow: `2px 2px 20px 0px ${customPalette.boxShadow2}`,
        fontSize: 11,
        fontWeight: 500,
        height: 48,
        padding: "16px 24px",
        width: 231,
      }}
    />
  );
};
