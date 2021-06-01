import SmartView from './smart-view.js';
import { formatDate } from '../utils/date.js';
import { DateFormat } from '../const.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { defaultDestinations, defaultOffers } from '../main.js';

const createTypeListOfRoutesTemplate = (offers, isDisabled) => {
  return offers
    .map((offer) => {
      return `
        <div class="event__type-item">
            <input 
              id="event-type-${offer.type}-1" 
              class="event__type-input  visually-hidden" 
              type="radio" 
              name="event-type" 
              value="${offer.type}" 
              data-point-type="${offer.type}" 
              data-route-name="${offer.type}"  
              ${isDisabled ? 'disabled' : ''}
            >
            <label 
              class="event__type-label  event__type-label--${offer.type}" 
              for="event-type-${offer.type}-1"
              ${isDisabled ? 'disabled' : ''}
            >
              ${offer.type}
            </label>
        </div>
        `;
    })
    .join('');
};

const createOptionsOfCities = (cities, isDisabled) => {
  return cities
    .map((city) => {
      return `<option ${isDisabled ? 'disabled' : ''} value="${city.name}"></option>`;
    })
    .join('');
};

const createOffersTemplate = (currentOffers, offers = [], isDisabled) => {
  let offersTemplate = null;
  const desiredOfferList = offers.find((offer) => offer.type === currentOffers.type);

  if (desiredOfferList && desiredOfferList.offers && desiredOfferList.offers.length) {
    offersTemplate = desiredOfferList.offers
      .map((offer) => {
        const checked = currentOffers.list.findIndex((it) => it.title === offer.title) !== -1 ? 'checked' : '';
        return `
        <div class="event__offer-selector">
            <input 
              class="event__offer-checkbox  visually-hidden" 
              id="${offer.title}" 
              type="checkbox" 
              name="${offer.title}" 
              data-price="${offer.price}" ${checked}
              ${isDisabled ? 'disabled' : ''}
            >
            <label 
              class="event__offer-label" 
              for="${offer.title}"
              ${isDisabled ? 'disabled' : ''}
            >
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
            </label>
        </div>
        `;
      })
      .join('');

    return `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersTemplate}
          </div>
        </section>
      `;
  }

  return '';
};

const createDestinationPhotosTemplate = (pictures) => {
  if (pictures.length) {
    return pictures
      .map((picture) => {
        return `
      <img 
        class="event__photo" 
        src="${picture.src}" 
        alt="${picture.description}"
      >`;
      })
      .join('');
  }
};

const createPointEditTemplate = (point) => {
  const { destination, basePrice, dateStart, dateEnd, offers, isDisabled, isSaving, isDeleting } = point;

  const srcToPointIcon = `img/icons/${offers.type}.png`;
  const typeListOfRoutesTemplate = createTypeListOfRoutesTemplate(defaultOffers, isDisabled);
  const optionsOfCitiesTemplate = createOptionsOfCities(defaultDestinations, isDisabled);
  const formattedDateStart = formatDate(dateStart, DateFormat.DATE_TIME);
  const formattedDateEnd = formatDate(dateEnd, DateFormat.DATE_TIME);
  const photosTemplate = createDestinationPhotosTemplate(destination.pictures);
  const offersTemplate = createOffersTemplate(offers, defaultOffers, isDisabled);

  return `
    <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
        <header class="event__header">
            <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1" ${isDisabled ? 'disabled' : ''}>
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="${srcToPointIcon}" alt="${offers.type}">
                </label>
                <input 
                  class="event__type-toggle  visually-hidden" 
                  id="event-type-toggle-1" type="checkbox" 
                  ${isDisabled ? 'disabled' : ''}
                >

                <div class="event__type-list">
                    <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                        ${typeListOfRoutesTemplate}
                    </fieldset>
                </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                    ${offers.type}
                </label>
                <input 
                  class="event__input  event__input--destination" 
                  id="event-destination-1" 
                  type="text" 
                  name="event-destination" 
                  value="${destination.name}" 
                  list="destination-list-1"
                  ${isDisabled ? 'disabled' : ''}
                >
                <datalist id="destination-list-1">
                    ${optionsOfCitiesTemplate}
                </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
                <label 
                  class="visually-hidden" 
                  for="event-start-time-1"
                  ${isDisabled ? 'disabled' : ''}
                >
                  From
                </label>
                <input 
                  class="event__input  event__input--time" 
                  id="event-start-time-1" 
                  type="text" 
                  name="event-start-time" 
                  value="${formattedDateStart}"
                  ${isDisabled ? 'disabled' : ''}
                >
                &mdash;
                <label 
                  class="visually-hidden" 
                  for="event-end-time-1"
                  ${isDisabled ? 'disabled' : ''}
                >
                  To
                </label>
                <input 
                  class="event__input  event__input--time" 
                  id="event-end-time-1" 
                  type="text" 
                  name="event-end-time" 
                  value="${formattedDateEnd}"
                  ${isDisabled ? 'disabled' : ''}
                >
            </div>

            <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1" ${isDisabled ? 'disabled' : ''}>
                    <span class="visually-hidden">Price</span>
                    &euro;
                </label>
                <input 
                  class="event__input  event__input--price" 
                  id="event-price-1" 
                  type="text" 
                  name="event-price" 
                  value="${basePrice}" 
                  ${isDisabled ? 'disabled' : ''}
                >
            </div>

            <button 
              class="event__save-btn  btn  btn--blue" 
              type="submit" 
              ${isDisabled ? 'disabled' : ''}
            >
              ${isSaving ? 'Saving...' : 'Save'}
            </button>
            <button 
              class="event__reset-btn" 
              type="reset" 
              ${isDisabled ? 'disabled' : ''}
            >
              ${isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
            </button>
        </header>
        <section class="event__details">
            ${offersTemplate}

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

const createDefaultPoint = () => {
  const defaultDestination = {
    name: '',
    description: '',
    pictures: [],
  };
  const defaultOffer = {
    type: '',
    list: [],
  };

  const destination = defaultDestinations ? defaultDestinations[0] : defaultDestination;
  const offers = defaultOffers ? { list: defaultOffers[0].offers, type: defaultOffers[0].type } : defaultOffer;

  return {
    basePrice: 0,
    dateEnd: new Date(),
    dateStart: new Date(),
    destination,
    isFavorite: false,
    offers,
  };
};

export default class EditPoint extends SmartView {
  constructor(point) {
    super();
    this._data = point || createDefaultPoint();
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._changePointTypeHandler = this._changePointTypeHandler.bind(this);
    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changeDatesHandler = this._changeDatesHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._changeBasePriceHandler = this._changeBasePriceHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPointEditTemplate(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this.setChangeOffers();
    this._handlers.formSubmit(this._data);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._handlers.closeEditPointClick();
  }

  _changePointTypeHandler(evt) {
    evt.preventDefault();
    const pointType = evt.target.dataset.pointType;
    this.updateData({
      offers: Object.assign({}, { type: pointType, list: [] }),
    });
  }

  _changeBasePriceHandler(evt) {
    evt.preventDefault();
    const rawValue = evt.target.value;
    const basePrice = rawValue ? rawValue.match(/(\d+)/)[0] : 0;
    this.updateData({
      basePrice,
    });
  }

  _changeDestinationHandler(evt) {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const desiredCity = defaultDestinations.find((city) => city.name === newDestinationName);
    if (desiredCity) {
      const newDestination = Object.assign({}, desiredCity);
      this.updateData({
        destination: newDestination,
      });
    }
  }

  _setInnerHandlers() {
    this.setChangePointEventHandler();
    this.setChangeDestinationHandler();
    this.setChangeBasePriceHandler();
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

  setChangeBasePriceHandler() {
    const basePriceInput = this.getElement().querySelector('.event__input--price');
    basePriceInput.addEventListener('change', this._changeBasePriceHandler);
  }

  setChangePointEventHandler() {
    const typePointInputs = this.getElement().querySelectorAll('.event__type-input');
    typePointInputs.forEach((typePoint) => {
      typePoint.addEventListener('change', this._changePointTypeHandler);
    });
  }

  setChangeOffers() {
    const offersInputs = this.getElement().querySelectorAll('.event__offer-checkbox');
    const list = [...offersInputs].reduce((acc, cur) => {
      if (cur.checked) {
        acc.push({
          price: cur.dataset.price,
          title: cur.name,
        });
      }

      return acc;
    }, []);
    this.updateData({
      offers: {
        list,
        type: this._data.offers.type,
      },
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
