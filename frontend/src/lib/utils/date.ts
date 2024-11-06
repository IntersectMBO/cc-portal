import { format } from "date-fns";
/**
 * Formats a given date into a specified display format.
 *
 * The function converts the input date into a string representation according to
 * the specified format. By default, it uses the "d.MM.yyyy" format, but a different
 * format can be provided if needed.
 *
 * @param date - The date to format. This can be a string or a `Date` object.
 * @param outputFormat - The format string that specifies the desired output format.
 *                        Defaults to "d.MM.yyyy" if not specified.
 * @returns A string representing the formatted date based on the `outputFormat`.
 *
 * @example
 * formatDisplayDate("2024-08-05");
 * // Returns "5.08.2024" (using default format)
 *
 * formatDisplayDate(new Date(), "yyyy/MM/dd");
 * // Returns "2024/08/05" (current date in specified format)
 *
 * formatDisplayDate("2024-08-05", "MMMM d, yyyy");
 * // Returns "August 5, 2024"
 */
export const formatDisplayDate = (
  date: string | Date,
  outputFormat = "Qo MMM yyyy"
) => format(new Date(date), outputFormat).toString();
