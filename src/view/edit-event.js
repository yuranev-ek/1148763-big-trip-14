import AbstractView from './abstract-view.js';
import { ROUTES, CITIES } from '../mock/event.js';
import { formatDate } from '../utils/date.js';
import { DATE_FORMAT } from '../const.js';
import { OFFERS } from '../mock/offer.js';

const createTypeListOfRoutesTemplate = (routes) => {
  return routes
    .map((route) => {
      return `
        <div class="event__type-item">
            <input id="event-type-${route.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${route.name}">
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

const createEditEventTemplate = (event) => {
  const { route, destination, basePrice, dateStart, dateEnd, offers } = event;

  const srcToEventIcon = `img/icons/${route}.png`;
  const typeListOfRoutesTemplate = createTypeListOfRoutesTemplate(ROUTES);
  const optionsOfCitiesTemplate = createOptionsOfCities(CITIES);
  const formattedDateStart = formatDate(dateStart, DATE_FORMAT.DATE_TIME);
  const formattedDateEnd = formatDate(dateEnd, DATE_FORMAT.DATE_TIME);
  const offersTemplate = createOffersTemplate(offers.list, OFFERS[offers.type]);

  return `
    <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
        <header class="event__header">
            <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="${srcToEventIcon}" alt="${route}">
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
            </section>
        </section>
        </form>
    </li>
    `;
};

export default class EditEvent extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
  }
  getTemplate() {
    return createEditEventTemplate(this._event);
  }
}
