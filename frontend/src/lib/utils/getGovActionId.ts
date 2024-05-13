export const getShortenedGovActionId = (txHash: string) => {
  if (txHash.length <= 6) {
    return `${txHash}`;
  }
  const firstPart = txHash.slice(0, 4);
  const lastPart = txHash.slice(-4);

  return `${firstPart}...${lastPart}`;
};
