// Source - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomBoolean = () => {
  return Boolean(getRandomInteger(0, 1));
};

export const sumByKey = (array, key) => {
  return array.reduce((acc, cur) => cur[key], 0);
};

export const generateToken = () => {
  return Math.random().toString(36).substr(2);
};
