import AbstractView from './abstract-view.js';

const createFiltersTemplate = (filters, currentFilterType) => {
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
          >
          <label class="trip-filters__filter-label" for="filter-${filters.EVERYTHING}">${filters.EVERYTHING}</label>
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
          >
          <label class="trip-filters__filter-label" for="filter-${filters.FUTURE}">${filters.FUTURE}</label>
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
          >
          <label class="trip-filters__filter-label" for="filter-${filters.PAST}">${filters.PAST}</label>
        </div>

        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
    `;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
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
