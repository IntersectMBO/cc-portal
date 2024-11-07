import { format, parseISO } from "date-fns";
/**
 * Formats a given date into a specified display format.
 *
 * The function converts the input date string into a date object and then formats it
 * according to the "do LLL yyyy" format, which will display the date in the format
 * "23rd Aug 2024".
 *
 * @param dateString - The date string to format. This should be in the ISO 8601 format
 *                     (e.g., "2024-08-23T04:08:06.000Z").
 * @returns A string representing the formatted date.
 *
 * @example
 * formatDisplayDate("2024-08-23T04:08:06.000Z");
 * // Returns "23rd Aug 2024"
 *
 * formatDisplayDate("invalid date");
 * // Returns "Invalid date"
 */
export function formatDisplayDate(date: string | Date): string {
  let dateToFormat: Date;

  if (typeof date === "string") {
    try {
      dateToFormat = parseISO(date);
    } catch (error) {
      return "Invalid date";
    }
  } else if (date instanceof Date) {
    dateToFormat = date;
  } else {
    return "Invalid date";
  }

  return format(dateToFormat, "do LLL yyyy");
}
