import { format } from "date-fns";

export const formatDisplayDate = (
  date: string | Date,
  outputFormat = "d.MM.yyyy"
) => format(new Date(date), outputFormat).toString();
