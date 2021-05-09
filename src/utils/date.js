import dayjs from 'dayjs';

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
