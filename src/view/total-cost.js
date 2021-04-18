import AbstractView from './abstract-view.js';
import { sumByKey } from '../utils/common.js';

const createTotalCostTemplate = (events) => {
  const totalCost = events.reduce((acc, event) => acc + event.basePrice + sumByKey(event.offers.list, 'price'), 0);

  return `
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
    `;
};

export default class TotalCost extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTotalCostTemplate(this._events);
  }
}
