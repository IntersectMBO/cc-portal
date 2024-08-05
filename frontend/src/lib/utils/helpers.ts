import { ResponseErrorI } from "../requests";

/**
 * Checks if the given value is an empty object, an empty array, `null`, or `undefined`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an empty object, an empty array, `null`, or `undefined`, `false` otherwise.
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  } else if (value && typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return false;
};

/**
 * Calculates the total number of selected filters.
 *
 * This function takes an object representing chosen filters, where each key corresponds
 * to a category and each value is an array of selected filters for that category.
 * It returns the total number of selected filters across all categories.
 *
 * @param {Record<string, string[]>} chosenFilters - An object where each key is a filter category and each value is an array of selected filters for that category.
 * @returns {number} - The total number of selected filters across all categories.
 */
export const countSelectedFilters = (
  chosenFilters: Record<string, string[]>
): number => {
  return Object.values(chosenFilters).reduce(
    (total, filters) => total + filters.length,
    0
  );
};

/**
 * Type guard function to check if an object is of type ResponseErrorI.
 *
 * @param obj - The object to check.
 * @returns A boolean indicating whether the object has an "error" property,
 *          meaning it is of type ResponseErrorI.
 */
export const isResponseErrorI = (obj: any): obj is ResponseErrorI => {
  return obj !== null && typeof obj === "object" && "error" in obj;
};
