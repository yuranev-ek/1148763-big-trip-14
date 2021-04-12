import { sumByKey } from '../utils.js';

export const createTotalCostTemplate = (events) => {
  let totalCost = 0;
  events.forEach((event) => {
    totalCost += event.basePrice;
    totalCost += sumByKey(event.offers.list, 'price');
  });

  return `
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
    `;
};
