import random from "lodash/random";

export const generateRandomNumbers = (
  min: number,
  max: number,
  cnt: number
): number[] => {
  const rdmNumbers = [];
  while (rdmNumbers.length < cnt) {
    const r = random(min, max);

    if (rdmNumbers.indexOf(r) === -1) rdmNumbers.push(r);
  }
  return rdmNumbers;
};

export const generateRandomNumber = (min: number, max: number): number => {
  return random(min, max);
};
