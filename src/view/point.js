import SmartView from './smart-view.js';
import { formatDate, getDiffOfDates } from '../utils/date.js';
import { DateFormat } from '../const.js';

export const diffConvertedTimeOfPoint = (dateEnd, dateStart) => {
  const diffMinutesOfPoint = getDiffOfDates(dateEnd, dateStart, 'minute') % 60;
  const diffHoursOfPoint = getDiffOfDates(dateEnd, dateStart, 'hour') % 24;
  const diffDaysOfPoint = getDiffOfDates(dateEnd, dateStart);
  let convertedTime = '';

  const addZero = (num) => {
    return `${num}`.length === 1 ? `0${num}` : num;
  };

  if (diffDaysOfPoint) {
    convertedTime += `${addZero(diffDaysOfPoint)}D`;
  }

  if (diffHoursOfPoint || diffDaysOfPoint) {
    convertedTime += ` ${addZero(diffHoursOfPoint)}H`;
  }

  convertedTime += ` ${addZero(diffMinutesOfPoint)}M`;

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

const createPointTemplate = (point) => {
  const { destination, isFavorite, basePrice, dateStart, dateEnd, offers } = point;

  const srcToPointIcon = `img/icons/${offers.type}.png`;
  const classByIsFavorite = isFavorite ? 'event__favorite-btn--active' : '';

  const attrDateOfDateStart = formatDate(dateStart, DateFormat.ATTR_DATE);
  const attrDateTimeOfDateStart = formatDate(dateStart, DateFormat.ATTR_DATE_TIME);
  const attrDateTimeOfDateEnd = formatDate(dateEnd, DateFormat.ATTR_DATE_TIME);
  const startPointTime = formatDate(dateStart, DateFormat.TIME);
  const endPointTime = formatDate(dateEnd, DateFormat.TIME);
  const pointDay = formatDate(dateStart, DateFormat.DAY);
  const diffTime = diffConvertedTimeOfPoint(dateEnd, dateStart);

  const offersTemplate = createOffersTemplate(offers.list);

  return `
    <li class="trip-events__item">
      <div class="event">
          <time class="event__date" datetime="${attrDateOfDateStart}">
            ${pointDay}
          </time>
          <div class="event__type">
              <img class="event__type-icon" width="42" height="42" src="${srcToPointIcon}" alt="${offers.type}">
          </div>
          <h3 class="event__title">${offers.type} ${destination.name}</h3>
          <div class="event__schedule">
              <p class="event__time">
              <time class="event__start-time" datetime="${attrDateTimeOfDateStart}">${startPointTime}</time>
              &mdash;
              <time class="event__end-time" datetime="${attrDateTimeOfDateEnd}">${endPointTime}</time>
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
    </li>
    `;
};

export default class Point extends SmartView {
  constructor(point) {
    super();
    this._data = point;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._data);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._handlers.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._handlers.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._handlers.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._handlers.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
