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
