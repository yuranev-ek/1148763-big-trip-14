export const DATE_FORMAT = {
  ATTR_DATE: 'DD-MM-YYYY',
  ATTR_DATE_TIME: 'DD-MM-YYYYTHH:mm',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
  DAY: 'MMM D',
};

export const RENDER_POSITION = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const POINT_COUNT = 15;

export const APP_ELEMENT_CLASSES = {
  HEADER: '.trip-main',
  INFO: '.trip-main__trip-info',
  MENU: '.trip-controls__navigation',
  FILTERS: '.trip-controls__filters',
  POINTS: '.trip-events',
  POINTS_LIST: '.trip-events__list',
};

export const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PAST: 'Past',
};
