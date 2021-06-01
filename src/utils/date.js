import dayjs from 'dayjs';

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getDiffOfDates = (from, to, type = 'day') => {
  return dayjs(from).diff(dayjs(to), type);
};

export const isAfter = (date1, date2) => {
  return dayjs(date1).isAfter(dayjs(date2));
};
