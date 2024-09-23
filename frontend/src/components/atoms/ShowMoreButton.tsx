import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { Loading } from "../molecules";
import { Button } from "./Button";

interface Props {
  isLoading: boolean;
  hasNextPage: boolean;
  callBack: () => void;
}
export const ShowMoreButton = ({ isLoading, hasNextPage, callBack }: Props) => {
  const t = useTranslations("General");
  return isLoading ? (
    <Loading />
  ) : (
    hasNextPage && (
      <Box textAlign="center">
        <Button variant="outlined" onClick={callBack} data-testid="page-content-show-more-button">
          {t("showMore")}
        </Button>
      </Box>
    )
  );
};
