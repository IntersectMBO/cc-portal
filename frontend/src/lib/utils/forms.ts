/**
 * Creates a FormData object with non-empty properties from the provided data object.
 * @param data The data object containing properties to be appended to the FormData.
 * @returns A FormData object containing non-empty properties from the data object.
 */
export const createFormDataObject = (data: FormData): FormData => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  }

  return formData;
};
