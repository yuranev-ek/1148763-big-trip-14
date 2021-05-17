import { subtractDays, addDays, getRandomPeriod } from '../utils/date.js';
import { getRandomInteger, getRandomBoolean } from '../utils/common.js';
import { generateOffers, OFFERS } from './offer.js';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const LOREM_SENTENCES = LOREM.split('. ');

export const TYPE_OF_ROUTE = {
  TRIP: 'trip',
  STOP: 'stop',
};

export const ROUTES = [
  {
    name: 'taxi',
    type: TYPE_OF_ROUTE.TRIP,
  },
  {
    name: 'bus',
    type: TYPE_OF_ROUTE.TRIP,
  },
  {
    name: 'train',
    type: TYPE_OF_ROUTE.TRIP,
  },
  {
    name: 'ship',
    type: TYPE_OF_ROUTE.TRIP,
  },
  {
    name: 'transport',
    type: TYPE_OF_ROUTE.TRIP,
  },
  {
    name: 'drive',
    type: TYPE_OF_ROUTE.TRIP,
  },
  {
    name: 'flight',
    type: TYPE_OF_ROUTE.TRIP,
  },
  {
    name: 'check-in',
    type: TYPE_OF_ROUTE.STOP,
  },
  {
    name: 'restaurant',
    type: TYPE_OF_ROUTE.STOP,
  },
  {
    name: 'sightseeing',
    type: TYPE_OF_ROUTE.STOP,
  },
];

export const CITIES = ['Chamonix', 'Paris', 'London', 'Geneva', 'Kazan', 'St. Petersburg'];

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

const DATE_META = {
  DAYS_BEFORE: 10,
  DAYS_AFTER: 30,
};

const generateRoute = () => {
  return ROUTES[getRandomInteger(0, ROUTES.length - 1)];
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

export const generateDestination = () => {
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

export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const generatePoint = () => {
  const route = generateRoute();
  const minDateStart = subtractDays(DATE_META.DAYS_BEFORE);
  const maxDateEnd = addDays(DATE_META.DAYS_AFTER);
  const period = getRandomPeriod(minDateStart, maxDateEnd);
  const numberOfOffers = getRandomInteger(0, OFFERS[route.type].length);

  return {
    id: generateId(),
    route: route.name,
    destination: generateDestination(),
    isFavorite: getRandomBoolean(),
    basePrice: generateBasePrice(),
    dateStart: period.dateStart,
    dateEnd: period.dateEnd,
    offers: {
      type: route.type,
      list: generateOffers(route.type, numberOfOffers),
    },
  };
};
