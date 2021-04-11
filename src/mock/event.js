import { getRandomInteger, getRandomBoolean } from '../utils.js';
import { LOREM_SENTENCES } from '../const.js';

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

const CITIES = ['Chamonix', 'Paris', 'London', 'Geneva', 'Kazan', 'St. Petersburg'];

const NUMBERS_OF_SENTENCES = {
  MIN: 1,
  MAX: 5,
};

const generateDescription = (num) => {
  const SLICED_LOREM_SENTENCES = LOREM_SENTENCES.slice();
  const sentences = [];

  while (num > sentences.length) {
    const randomIndex = getRandomInteger(0, SLICED_LOREM_SENTENCES.length - 1);
    sentences.push(SLICED_LOREM_SENTENCES[randomIndex]);
    SLICED_LOREM_SENTENCES.splice(randomIndex, 1);
  }

  return sentences.join('. ');
};

const generateDestination = () => {
  const numbersOfSentences = getRandomInteger(NUMBERS_OF_SENTENCES.MIN, NUMBERS_OF_SENTENCES.MAX);

  return {
    name: CITIES[getRandomInteger(0, CITIES.length - 1)],
    description: generateDescription(numbersOfSentences),
  };
};

export const generateEvent = () => {
  return {
    routeType: ROUTE_TYPES[getRandomInteger(0, ROUTE_TYPES.length - 1)],
    destination: generateDestination(),
    isFavorite: getRandomBoolean(),
  };
};
