import { getRandomInteger } from '../utils.js';

const ROUTE_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Transport',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

export const generateEvent = () => {
  return {
    routeType: ROUTE_TYPES[getRandomInteger(0, ROUTE_TYPES.length - 1)],
  };
};
