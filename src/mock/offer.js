import { getRandomInteger } from '../utils/common.js';

export const OFFERS = {
  trip: [
    {
      title: 'Add luggage',
      price: 20,
    },
    {
      title: 'Add meal',
      price: 15,
    },
    {
      title: 'Choose seats',
      price: 5,
    },
    {
      title: 'Availability of an air conditioner',
      price: 10,
    },
    {
      title: 'Switch to comfort',
      price: 80,
    },
    {
      title: 'Upgrade to a business class',
      price: 120,
    },
    {
      title: 'Choose the radio station',
      price: 60,
    },
  ],
  stop: [
    {
      title: 'Add breakfast',
      price: 50,
    },
    {
      title: 'Add lunch',
      price: 70,
    },
    {
      title: 'Add dinner',
      price: 90,
    },
    {
      title: 'Live music',
      price: 100,
    },
    {
      title: 'Dish from the chef',
      price: 200,
    },
    {
      title: 'Book tickets',
      price: 40,
    },
    {
      title: 'Lunch in city',
      price: 30,
    },
    {
      title: 'Take a photo against the background of the landmark',
      price: 5,
    },
    {
      title: 'Rent a car',
      price: 200,
    },
  ],
};

export const generateOffers = (type, num) => {
  const offersIndexes = new Array(OFFERS[type].length).fill();
  const offers = [];

  while (num > offers.length && OFFERS[type].length > num) {
    const randomIndex = getRandomInteger(0, offersIndexes.length - 1);
    offers.push(OFFERS[type][randomIndex]);
    offersIndexes.splice(randomIndex, 1);
  }

  return offers;
};
