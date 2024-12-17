"use client";

import { getMembers } from "@/lib/api";
import { PaginationMeta } from "@/lib/requests";
import { ShowMoreButton, Typography } from "@atoms";
import { useManageQueryParams, usePagination } from "@hooks";
import { Box, Grid } from "@mui/material";
import { isEmpty } from "@utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { NotFound } from "../NotFound";
import { UserListItem } from "../types";
import { MembersCard } from "./MembersCard";

import { DataActionsContainer } from "./DataActionsContainer";

export function MembersCardList({
  members,
  paginationMeta,
  error
}: {
  members: UserListItem[];
  paginationMeta: PaginationMeta;
  error?: string;
}) {
  const t = useTranslations("Members");
  const { updateQueryParams } = useManageQueryParams();
  const [searchText, setSearchText] = useState<string>("");
  const [chosenSorting, setChosenSorting] = useState<string>("");

  const params: Record<string, string | null> = {
    search: searchText || null,
    sortBy: chosenSorting || null
  };

  const { data, pagination, isLoading, loadMore } = usePagination(
    members,
    paginationMeta,
    (page) => getMembers({ page, ...params })
  );

  useEffect(() => {
    updateQueryParams(params);
  }, [searchText, chosenSorting, updateQueryParams]);

  return (
    <Box px={{ xxs: 3, md: 5 }} py={{ xxs: 3, md: 6 }}>
      <Box
        paddingBottom={4}
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xxs: "column", md: "row" }}
        alignItems={{ xxs: "left", md: "center" }}
      >
        <Typography variant="headline4">{t("title")}</Typography>
        <DataActionsContainer
          setSearchText={setSearchText}
          setChosenSorting={setChosenSorting}
        />
      </Box>
      {isEmpty(data) || error ? (
        <NotFound
          height="50vh"
          title="members.title"
          description="members.description"
        />
      ) : (
        <>
          <Grid
            container
            item
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {data &&
              data.map((members, index) => (
                <Grid
                  key={index}
                  item
                  xxs={12}
                  md={6}
                  lg={4}
                  data-testid={`members-${members.id}-card`}
                  sx={{
                    padding: 2,
                    paddingTop: 0
                  }}
                >
                  <MembersCard {...members} />
                </Grid>
              ))}
          </Grid>
          <ShowMoreButton
            isLoading={isLoading}
            hasNextPage={pagination.has_next_page}
            callBack={loadMore}
          />
        </>
      )}
    </Box>
  );
}
