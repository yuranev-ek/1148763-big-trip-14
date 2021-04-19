import AbstractView from './abstract-view.js';
import { formatDate, getDiffOfDates } from '../utils/date.js';
import { DATE_FORMAT } from '../const.js';

const diffConvertedTimeOfEvent = (dateEnd, dateStart) => {
  const diffMinutesOfEvent = getDiffOfDates(dateEnd, dateStart, 'minute') % 60;
  const diffHoursOfEvent = getDiffOfDates(dateEnd, dateStart, 'hour') % 24;
  const diffDaysOfEvent = getDiffOfDates(dateEnd, dateStart);
  let convertedTime = '';

  const addZero = (num) => {
    return `${num}`.length === 1 ? `0${num}` : num;
  };

  if (diffDaysOfEvent) {
    convertedTime += `${addZero(diffDaysOfEvent)}D`;
  }

  if (diffHoursOfEvent || diffDaysOfEvent) {
    convertedTime += ` ${addZero(diffHoursOfEvent)}H`;
  }

  convertedTime += ` ${addZero(diffMinutesOfEvent)}M`;

  return convertedTime.trim();
};

const createOffersTemplate = (offers) => {
  return offers
    .map((offer) => {
      return `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
  `;
    })
    .join('');
};

const createEventTemplate = (event) => {
  const { route, destination, isFavorite, basePrice, dateStart, dateEnd, offers } = event;

  const srcToEventIcon = `img/icons/${route}.png`;
  const classByIsFavorite = isFavorite ? 'event__favorite-btn--active' : '';

  const attrDateOfDateStart = formatDate(dateStart, DATE_FORMAT.ATTR_DATE);
  const attrDateTimeOfDateStart = formatDate(dateStart, DATE_FORMAT.ATTR_DATE_TIME);
  const attrDateTimeOfDateEnd = formatDate(dateEnd, DATE_FORMAT.ATTR_DATE_TIME);
  const startEventTime = formatDate(dateStart, DATE_FORMAT.TIME);
  const endEventTime = formatDate(dateEnd, DATE_FORMAT.TIME);
  const eventDay = formatDate(dateStart, DATE_FORMAT.DAY);
  const diffTime = diffConvertedTimeOfEvent(dateEnd, dateStart);

  const offersTemplate = createOffersTemplate(offers.list);

  return `
    <div class="event">
        <time class="event__date" datetime="${attrDateOfDateStart}">${eventDay}</time>
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="${srcToEventIcon}" alt="${route}">
        </div>
        <h3 class="event__title">${route} ${destination.name}</h3>
        <div class="event__schedule">
            <p class="event__time">
            <time class="event__start-time" datetime="${attrDateTimeOfDateStart}">${startEventTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${attrDateTimeOfDateEnd}">${endEventTime}</time>
            </p>
            <p class="event__duration">${diffTime}</p>
        </div>
        <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
            ${offersTemplate}
        </ul>
        <button class="event__favorite-btn ${classByIsFavorite}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
        </button>
        <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
        </button>
    </div>
    `;
};

export default class Event extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._handlers.editClick();
  }

  setEditClickHandler(callback) {
    this._handlers.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }
}
