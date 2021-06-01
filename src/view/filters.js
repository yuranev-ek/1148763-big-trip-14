import AbstractView from './abstract-view.js';

const createFiltersTemplate = (filters, currentFilterType, isDisabled) => {
  return `
    <form class="trip-filters" action="#" method="get">
        <div class="trip-filters__filter">
          <input 
            id="filter-${filters.EVERYTHING}" 
            class="trip-filters__filter-input  visually-hidden" 
            type="radio" 
            name="trip-${filters.EVERYTHING}" 
            value="${filters.EVERYTHING}" 
            ${filters.EVERYTHING === currentFilterType ? 'checked' : ''}
            data-filter-type="${filters.EVERYTHING}"
            ${isDisabled ? 'disabled' : ''}
          >
          <label 
            class="trip-filters__filter-label" 
            for="filter-${filters.EVERYTHING}"
            ${isDisabled ? 'disabled' : ''}
          >
            ${filters.EVERYTHING}
          </label>
        </div>

        <div class="trip-filters__filter">
          <input 
            id="filter-${filters.FUTURE}" 
            class="trip-filters__filter-input  visually-hidden" 
            type="radio" 
            name="trip-${filters.FUTURE}" 
            value="${filters.FUTURE}" 
            ${filters.FUTURE === currentFilterType ? 'checked' : ''}
            data-filter-type="${filters.FUTURE}"
            ${isDisabled ? 'disabled' : ''}
          >
          <label 
            class="trip-filters__filter-label" 
            for="filter-${filters.FUTURE}"
            ${isDisabled ? 'disabled' : ''}
          >
            ${filters.FUTURE}
          </label>
        </div>

        <div class="trip-filters__filter">
          <input 
            id="filter-${filters.PAST}" 
            class="trip-filters__filter-input  visually-hidden" 
            type="radio" 
            name="trip-${filters.PAST}" 
            value="${filters.PAST}" 
            ${filters.PAST === currentFilterType ? 'checked' : ''}
            data-filter-type="${filters.PAST}"
            ${isDisabled ? 'disabled' : ''}
          >
          <label 
            class="trip-filters__filter-label" 
            for="filter-${filters.PAST}"
            ${isDisabled ? 'disabled' : ''}
          >
            ${filters.PAST}
          </label>
        </div>

        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
    `;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType, isDisabled) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._isDisabled = isDisabled;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter, this._isDisabled);
  }

  _filterTypeChangeHandler(evt) {
    if ('filterType' in evt.target.dataset) {
      evt.preventDefault();
      this._handlers.filterTypeChange(evt.target.dataset.filterType);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._handlers.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
