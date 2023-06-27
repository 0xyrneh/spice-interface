export const shortAddress = (address: string, start = 6, end = -4): string => {
  return `${address.slice(0, start)}...${address.slice(end)}`;
};
