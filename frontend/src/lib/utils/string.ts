/**
 * Truncates a given text to a specified length and appends an ellipsis ("...") if the text exceeds the limit.
 * This function is useful for displaying shortened versions of longer texts, such as in previews or summaries.
 *
 * @param text - The text string to be truncated. It should be a non-null, non-undefined string.
 * @param limit - The maximum length of the text before truncation. The text will be truncated to this length.
 * @returns The truncated text with an ellipsis appended if the length exceeds the limit, or the original text if it's within the limit.
 * If the provided text is null, undefined, or an empty string, the function returns undefined.
 * If the text length is less than or equal to the specified limit, the function returns the text unchanged.
 * If the text length exceeds the limit, the function truncates the text to the limit and appends an ellipsis.
 *
 * @example
 * // Truncate the text to 10 characters and append an ellipsis
 * truncateText('This is a long piece of text', 10); // Returns: 'This is a ...'
 *
 * // If the text is shorter than the limit, it remains unchanged
 * truncateText('Short text', 10); // Returns: 'Short text'
 *
 * @example
 * // If the text is empty or undefined, the function returns undefined
 * truncateText('', 10); // Returns: undefined
 * truncateText(undefined, 10); // Returns: undefined
 */
export const truncateText = (text: string, limit: number): string => {
  if (!text) {
    return;
  }
  if (text.length <= limit) {
    return text;
  }
  const truncated = text.slice(0, limit) + "...";
  return truncated;
};
