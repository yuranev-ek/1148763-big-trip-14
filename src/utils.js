import dayjs from 'dayjs';

// Source - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomBoolean = () => {
  return Boolean(getRandomInteger(0, 1));
};

export const subtractDays = (num) => {
  return dayjs().subtract(num, 'day').format();
};

export const addDays = (num) => {
  return dayjs().add(num, 'day').format();
};

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getDiffOfDates = (from, to, type = 'day') => {
  return dayjs(from).diff(dayjs(to), type);
};

export const isAfter = (date1, date2) => {
  return dayjs(date1).isAfter(dayjs(date2));
};

const getRandomDate = (from, to) => {
  const fromMilli = dayjs(from).valueOf();
  const max = dayjs(to).valueOf() - fromMilli;
  const dateOffset = Math.floor(Math.random() * max + 1);
  const newDate = dayjs(fromMilli + dateOffset);

  return dayjs(newDate).format();
};

export const getRandomPeriod = (from, to) => {
  const dateStart = getRandomDate(from, to);
  const dateEnd = getRandomDate(dateStart, to);

  return {
    dateStart,
    dateEnd,
  };
};

export const sumByKey = (array, key) => {
  return array.reduce((acc, cur) => (acc += cur[key]), 0);
};
