import SmartView from './smart-view.js';
import { ROUTES, CITIES, generateDestination } from '../mock/point.js';
import { formatDate } from '../utils/date.js';
import { DATE_FORMAT } from '../const.js';
import { OFFERS } from '../mock/offer.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createTypeListOfRoutesTemplate = (routes) => {
  return routes
    .map((route) => {
      return `
        <div class="event__type-item">
            <input id="event-type-${route.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${route.name}" data-point-type="${route.type}" data-route-name="${route.name}">
            <label class="event__type-label  event__type-label--${route.name}" for="event-type-${route.name}-1">${route.name}</label>
        </div>
        `;
    })
    .join('');
};

const createOptionsOfCities = (cities) => {
  return cities
    .map((city) => {
      return `<option value="${city}"></option>`;
    })
    .join('');
};

const createOffersTemplate = (checkedOffers, offers) => {
  return offers
    .map((offer) => {
      const checked = checkedOffers.findIndex((it) => it.title === offer.title) !== -1 ? 'checked' : '';
      return `
        <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-${offer.title}" type="checkbox" name="event-${offer.title}" ${checked}>
            <label class="event__offer-label" for="event-${offer.title}">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
            </label>
        </div>
        `;
    })
    .join('');
};

const createDestinationPhotosTemplate = (photos) => {
  return photos
    .map((photo) => {
      return `
      <img 
        class="event__photo" 
        src="${photo.src}" 
        alt="${photo.description}"
      >`;
    })
    .join('');
};

const createEditPointTemplate = (point) => {
  const { route, destination, basePrice, dateStart, dateEnd, offers } = point;

  const srcToPointIcon = `img/icons/${route}.png`;
  const typeListOfRoutesTemplate = createTypeListOfRoutesTemplate(ROUTES);
  const optionsOfCitiesTemplate = createOptionsOfCities(CITIES);
  const formattedDateStart = formatDate(dateStart, DATE_FORMAT.DATE_TIME);
  const formattedDateEnd = formatDate(dateEnd, DATE_FORMAT.DATE_TIME);
  const photosTemplate = createDestinationPhotosTemplate(point.destination.pictures);
  const offersTemplate = createOffersTemplate(offers.list, OFFERS[offers.type]);

  return `
    <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
        <header class="event__header">
            <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="${srcToPointIcon}" alt="${route}">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                    <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                        ${typeListOfRoutesTemplate}
                    </fieldset>
                </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                    ${route}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                <datalist id="destination-list-1">
                    ${optionsOfCitiesTemplate}
                </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedDateStart}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedDateEnd}">
            </div>

            <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
            </button>
        </header>
        <section class="event__details">
            <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                    ${offersTemplate}
                </div>
            </section>

            <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${destination.description}</p>
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${photosTemplate}
                  </div>
                </div>
            </section>
        </section>
        </form>
    </li>
    `;
};

export default class EditPoint extends SmartView {
  constructor(point) {
    super();
    this._data = point;
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._changePointTypeHandler = this._changePointTypeHandler.bind(this);
    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changeDatesHandler = this._changeDatesHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._handlers.formSubmit(this._data);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._handlers.closeEditPointClick();
  }

  _changePointTypeHandler(evt) {
    evt.preventDefault();
    const pointType = evt.target.dataset.pointType;
    const routeName = evt.target.dataset.routeName;
    this.updateData({ route: routeName });
    this.updateData({
      offers: Object.assign({}, this._data.offers, { type: pointType }),
    });
  }

  _changeDestinationHandler(evt) {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const isCityExist = CITIES.findIndex((city) => city === newDestinationName) !== -1;
    if (isCityExist) {
      const newDestination = Object.assign({}, generateDestination(), {
        name: newDestinationName,
      });
      this.updateData({
        destination: newDestination,
      });
    }
  }

  _setInnerHandlers() {
    this.setChangePointEventHandler();
    this.setChangeDestinationHandler();
    this._setDatepicker();
  }

  setFormSubmitHandler(callback) {
    this._handlers.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setCloseClickHandler(callback) {
    this._handlers.closeEditPointClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
  }

  setChangePointEventHandler() {
    const typePointInputs = this.getElement().querySelectorAll('.event__type-input');
    typePointInputs.forEach((typePoint) => {
      typePoint.addEventListener('change', this._changePointTypeHandler);
    });
  }

  setChangeDestinationHandler() {
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._changeDestinationHandler);
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.dateStart) {
      this._datepicker = flatpickr(this.getElement().querySelector('#event-start-time-1'), {
        mode: 'range',
        dateFormat: 'Y/m/d H:i',
        defaultDate: this._data.dateStart,
        enableTime: true,
        onChange: this._changeDatesHandler,
      });
    }

    if (this._data.dateEnd) {
      this._datepicker = flatpickr(this.getElement().querySelector('#event-end-time-1'), {
        mode: 'range',
        dateFormat: 'Y/m/d H:i',
        defaultDate: this._data.dateEnd,
        enableTime: true,
        onChange: this._changeDatesHandler,
      });
    }
  }

  _changeDatesHandler(dates) {
    const [dateStart, dateEnd] = dates;
    this.updateData({
      dateStart,
    });
    this.updateData({
      dateEnd,
    });
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._handlers.deleteClick(this._data);
  }

  setDeleteClickHandler(callback) {
    this._handlers.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._handlers.formSubmit);
    this._setDatepicker();
    this.setCloseClickHandler(this._handlers.closeEditPointClick);
    this.setDeleteClickHandler(this._handlers.deleteClick);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }
}
