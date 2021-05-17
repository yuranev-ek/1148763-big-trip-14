import { FilterType } from '../const.js';
import { isAfter } from '../utils/date.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isAfter(point.dateStart, new Date())),
  [FilterType.PAST]: (points) => points.filter((point) => !isAfter(point.dateStart, new Date())),
};
