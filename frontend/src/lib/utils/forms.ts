/**
 * Creates a FormData object with non-empty properties from the provided data object.
 *
 * This function converts a plain object into a FormData object, including only those
 * properties that have non-empty values. The FormData object is useful for constructing
 * form submissions or sending data in a multipart format.
 *
 * @param data - An object containing properties to be appended to the FormData.
 *               Only properties with non-empty values will be included in the FormData.
 *
 * @returns A FormData object populated with non-empty properties from the provided data object.
 *
 * @example
 * // Create a FormData object from a data object
 * const data = {
 *   name: "John Doe",
 *   email: "john.doe@example.com",
 *   emptyField: "" // This will be excluded from the FormData
 * };
 * const formData = createFormDataObject(data);
 * // formData will contain only 'name' and 'email' fields
 */
export const createFormDataObject = (data: {
  [key: string]: any;
}): FormData => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  }

  return formData;
};
