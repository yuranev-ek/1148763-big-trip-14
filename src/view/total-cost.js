import AbstractView from './abstract-view.js';
import { sumByKey } from '../utils/common.js';

const createTotalCostTemplate = (points = []) => {
  if (points.length) {
    const totalCost = points.reduce((acc, event) => acc + event.basePrice + sumByKey(event.offers.list, 'price'), 0);

    return `
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
    `;
  }

  return '<div></div>';
};

export default class TotalCost extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTotalCostTemplate(this._points);
  }
}
