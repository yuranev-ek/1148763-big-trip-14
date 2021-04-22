import { sumByKey } from '../utils.js';

export const createTotalCostTemplate = (events) => {
  const totalCost = events.reduce((acc, event) => acc + event.basePrice + sumByKey(event.offers.list, 'price'), 0);

  return `
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
    `;
};
