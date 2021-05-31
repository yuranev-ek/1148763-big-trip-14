import AbstractView from './abstract-view.js';
import { SortType } from '../const.js';

const createSortTemplate = (currentSortType) => {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" 
        ${currentSortType === SortType.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day" data-sort-type="${SortType.DAY}">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" 
        ${currentSortType === SortType.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time" data-sort-type="${SortType.TIME}">Time</label>
    </div> 

    <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" 
        ${currentSortType === SortType.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price" data-sort-type="${SortType.PRICE}">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
    </form>
    `;
};

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._currentSortType = SortType.DAY;
    this._sortInputs = null;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.dataset && 'sortType' in evt.target.dataset) {
      const sortName = evt.target.dataset.sortType;
      evt.preventDefault();
      if (sortName !== this._currentSortType) {
        this._handlers.sortTypeChange(sortName);
        this.changeSortInput(sortName);
      }
    }
  }

  setSortTypeChangeHandler(callback) {
    this._handlers.sortTypeChange = callback;
    this._sortInputs = this.getElement().querySelectorAll('.trip-sort__btn');
    if (this._sortInputs) {
      this._sortInputs.forEach((sortInput) => {
        sortInput.addEventListener('click', this._sortTypeChangeHandler);
      });
    }
  }

  changeSortInput(sortName) {
    if (this._sortInputs !== null) {
      this._sortInputs.forEach((sortInput) => {
        const isActive = sortInput.dataset.sortType === sortName;
        sortInput.previousElementSibling.checked = isActive ? 'checked' : '';
        if (isActive) {
          this._currentSortType = sortName;
        }
      });
    }
  }
}
