import { ROUTES } from '../mock/event.js';

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

export const createEditEventTemplate = (event) => {
  const { route, destination, isFavorite, basePrice, dateStart, dateEnd } = event;

  const srcToEventIcon = `img/icons/${route}.png`;
  const typeListOfRoutesTemplate = createTypeListOfRoutesTemplate(ROUTES);

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
                    <option value="Amsterdam"></option>
                    <option value="Geneva"></option>
                    <option value="Chamonix"></option>
                </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
            </div>

            <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
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
                <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
                <label class="event__offer-label" for="event-offer-luggage-1">
                    <span class="event__offer-title">Add luggage</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">50</span>
                </label>
                </div>

                <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
                <label class="event__offer-label" for="event-offer-comfort-1">
                    <span class="event__offer-title">Switch to comfort</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">80</span>
                </label>
                </div>

                <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
                <label class="event__offer-label" for="event-offer-meal-1">
                    <span class="event__offer-title">Add meal</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">15</span>
                </label>
                </div>

                <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
                <label class="event__offer-label" for="event-offer-seats-1">
                    <span class="event__offer-title">Choose seats</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">5</span>
                </label>
                </div>

                <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
                <label class="event__offer-label" for="event-offer-train-1">
                    <span class="event__offer-title">Travel by train</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">40</span>
                </label>
                </div>
            </div>
            </section>

            <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.</p>
            </section>
        </section>
        </form>
    </li>
    `;
};
