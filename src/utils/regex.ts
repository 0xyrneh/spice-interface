export const POSITIVE_FLOAT_REGEX = /^(\d*)([,.]\d*)?$/;

export const isValidNumber = (value: string) =>
  value === "" || POSITIVE_FLOAT_REGEX.test(value);
