export const getShortenedGovActionId = (txHash: string, sliceTo = 4) => {
  if (txHash.length <= 6) {
    return `${txHash}`;
  }
  const firstPart = txHash.slice(0, sliceTo);
  const lastPart = txHash.slice(-sliceTo);

  return `${firstPart}...${lastPart}`;
};
