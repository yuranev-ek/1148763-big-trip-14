export const DateFormat = {
  ATTR_DATE: 'DD-MM-YYYY',
  ATTR_DATE_TIME: 'DD-MM-YYYYTHH:mm',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
  DAY: 'MMM D',
};

export const AppElementClasses = {
  HEADER: '.trip-main',
  MENU: '.trip-controls__navigation',
  FILTERS: '.trip-controls__filters',
  POINTS: '.trip-events',
  POINTS_LIST: '.trip-events__list',
  NEW_EVENT_BUTTON: '.trip-main__event-add-btn',
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
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PAST: 'Past',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};
