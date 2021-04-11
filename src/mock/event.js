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

const PICTURE_META = {
  MIN: 1,
  MAX: 10,
  SRC: 'http://picsum.photos/300/200?r=',
};

const BASE_PRICE_META = {
  MIN: 50,
  MAX: 1000,
};

const generateRouteType = () => {
  return ROUTE_TYPES[getRandomInteger(0, ROUTE_TYPES.length - 1)];
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

const generatePictures = (num) => {
  const pictures = [];

  while (num > pictures.length) {
    pictures.push({
      src: `${PICTURE_META.SRC}${Math.random()}`,
      description: LOREM_SENTENCES[getRandomInteger(0, LOREM_SENTENCES.length - 1)],
    });
  }

  return pictures;
};

const generateDestination = () => {
  const numbersOfSentences = getRandomInteger(NUMBERS_OF_SENTENCES.MIN, NUMBERS_OF_SENTENCES.MAX);
  const numberOfPictures = getRandomInteger(PICTURE_META.MIN, PICTURE_META.MAX);

  return {
    name: CITIES[getRandomInteger(0, CITIES.length - 1)],
    description: generateDescription(numbersOfSentences),
    pictures: generatePictures(numberOfPictures),
  };
};

const generateBasePrice = () => {
  return getRandomInteger(BASE_PRICE_META.MIN, BASE_PRICE_META.MAX);
};

export const generateEvent = () => {
  return {
    routeType: generateRouteType(),
    destination: generateDestination(),
    isFavorite: getRandomBoolean(),
    basePrice: generateBasePrice(),
  };
};
