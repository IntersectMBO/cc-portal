/**
 * Shortens a given transaction hash (`txHash`) by slicing it into a shortened format.
 *
 * The function returns a shortened version of the `txHash`, showing the first few characters
 * and the last few characters, separated by ellipses ("..."). This is useful for displaying
 * long hash values in a more readable format.
 *
 * @param txHash - The full transaction hash to be shortened. This should be a string.
 * @param sliceTo - The number of characters to include from the beginning and end of the hash.
 *                   Defaults to 4 if not specified.
 * @returns A shortened string with the first and last `sliceTo` characters of the `txHash`,
 *          separated by ellipses.
 * @example
 * getShortenedGovActionId("abcdefghij");
 * // Returns "abcd...hij"
 *
 * getShortenedGovActionId("1234567890", 6);
 * // Returns "123456...7890"
 *
 * getShortenedGovActionId("short");
 * // Returns "short" (since length is <= 6)
 */
export const getShortenedGovActionId = (txHash: string, sliceTo = 4) => {
  if (txHash.length <= 6) {
    return `${txHash}`;
  }
  const firstPart = txHash.slice(0, sliceTo);
  const lastPart = txHash.slice(-sliceTo);

  return `${firstPart}...${lastPart}`;
};
