export const sumByKey = (array, key) => {
  return array.reduce((acc, cur) => cur[key], 0);
};
