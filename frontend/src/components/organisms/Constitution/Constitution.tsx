"use client";
import { Grid } from "@mui/material";
import React, { useState } from "react";
import { ConstitutionProps } from "../types";
import ConstitutionPage from "./ConstitutionPage";
import PaginationButton from "./PaginationButton";

// Number of characters/array elements to display per page
const charactersPerPage = 10;
// Number of pages to display per view
const pagesPerView = 2;

export default function Constitution({
  constitution: { content },
}: ConstitutionProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const contentArray = React.Children.toArray(content);

  // Split the content into pages
  const contentPerPage = [];
  for (let i = 0; i < contentArray.length; i += charactersPerPage) {
    contentPerPage.push(contentArray.slice(i, i + charactersPerPage));
  }

  // Total number of pages
  const totalPages = contentPerPage.length;

  // Calculate the indexes of the pages to display
  const startIndex = (currentPage - 1) * pagesPerView;
  const endIndex = Math.min(startIndex + pagesPerView, totalPages);
  const currentPagePreview = contentPerPage.slice(startIndex, endIndex);

  // Determine if previous/next page navigation is allowed
  const isPrevPageAllowed = currentPage !== 1;
  const isNextPageAllowed = currentPage < totalPages / pagesPerView;

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  return (
    <Grid
      container
      data-testid="constitution-wrapper"
      height={{ xxs: "auto", lg: "80vh" }}
      justifyContent="center"
      alignItems="center"
      flexWrap="nowrap"
      flexDirection={{ xxs: "column", lg: "row" }}
      gap={{ xxs: 2, lg: 6 }}
      sx={{
        py: { xxs: 1, md: 3 },
        maxWidth: { xxs: "90%", lg: 1500 },
        mx: "auto",
      }}
    >
      <Grid item sx={{ display: { xxs: "none", lg: "block" } }}>
        <PaginationButton
          disabled={!isPrevPageAllowed}
          handleClick={handlePreviousPage}
          type="prev"
        />
      </Grid>

      <Grid
        item
        data-testid="constitution-preview-wrapper"
        container
        sx={{
          flex: 1,
          display: "flex",
        }}
      >
        {currentPagePreview.map((pageContent, index) => (
          <ConstitutionPage key={index} content={pageContent} />
        ))}
      </Grid>

      <Grid item sx={{ display: { xxs: "none", lg: "flex" } }}>
        <PaginationButton
          disabled={!isNextPageAllowed}
          handleClick={handleNextPage}
          type="next"
        />
      </Grid>

      {/** Mobile & Tablet Pagination Buttons */}
      <Grid
        data-testid="constitution-wrapper-mobile"
        container
        justifyContent="center"
        sx={{ display: { xxs: "flex", lg: "none" } }}
      >
        <Grid item>
          <PaginationButton
            disabled={!isPrevPageAllowed}
            handleClick={handlePreviousPage}
            type="prev"
          />
        </Grid>
        <Grid item>
          <PaginationButton
            disabled={!isNextPageAllowed}
            handleClick={handleNextPage}
            type="next"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
