import { ResponseErrorI } from "../requests";

/**
 * Checks if the given value is an empty object, an empty array, `null`, or `undefined`.
 *
 * This function is used to determine if a value is considered "empty" according to specific rules:
 * - `null` and `undefined` are considered empty.
 * - Empty arrays (length of 0) are considered empty.
 * - Empty objects (objects with no enumerable properties) are considered empty.
 *
 * @param value - The value to check. Can be of any type.
 * @returns `true` if the value is an empty object, an empty array, `null`, or `undefined`; `false` otherwise.
 *
 * @example
 * // Example usage
 * isEmpty(null); // true
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty([1, 2, 3]); // false
 * isEmpty({ key: "value" }); // false
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
 * This function takes an object where each key represents a filter category, and each value is an array
 * of selected filters for that category. It sums up the total number of selected filters across all categories.
 *
 * @param chosenFilters - An object where each key is a filter category, and each value is an array of selected filters.
 * @returns The total number of selected filters across all categories.
 *
 * @example
 * // Example usage
 * const filters = {
 *   category1: ['filter1', 'filter2'],
 *   category2: ['filter3'],
 * };
 * countSelectedFilters(filters); // returns 3
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
 * This function checks whether the given object is an instance of ResponseErrorI by verifying the presence
 * of the "error" property.
 *
 * @param obj - The object to check.
 * @returns A boolean indicating whether the object has an "error" property and is of type ResponseErrorI.
 *
 * @example
 * // Example usage
 * const errorObject = { error: "Something went wrong" };
 * isResponseErrorI(errorObject); // true
 * const notErrorObject = { message: "Success" };
 * isResponseErrorI(notErrorObject); // false
 */
export const isResponseErrorI = (obj: any): obj is ResponseErrorI => {
  return obj !== null && typeof obj === "object" && "error" in obj;
};
