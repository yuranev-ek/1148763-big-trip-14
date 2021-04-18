// templates
import { createEditEventTemplate } from './view/edit-event.js';
import TotalCostView from './view/total-cost.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import RouteInformationView from './view/route-information.js';
import ListOfEventsView from './view/list-of-events.js';
import EventView from './view/event.js';

// mocks
import { generateEvent } from './mock/event.js';

// utils
import { isAfter } from './utils/date.js';
import { renderElement, renderTemplate } from './utils/render.js';

// const
import { RENDER_POSITION } from './const.js';

const EVENT_COUNT = 15;
const events = new Array(EVENT_COUNT)
  .fill()
  .map(generateEvent)
  .sort((a, b) => {
    return isAfter(a.dateStart, b.dateStart) ? 1 : -1;
  });

const siteHeaderElement = document.querySelector('.trip-main');
renderElement(siteHeaderElement, new RouteInformationView(events).getElement(), RENDER_POSITION.AFTERBEGIN);

const siteInfoElement = siteHeaderElement.querySelector('.trip-main__trip-info');
renderElement(siteInfoElement, new TotalCostView(events).getElement(), RENDER_POSITION.BEFOREEND);

const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
renderElement(siteMenuElement, new MenuView().getElement(), RENDER_POSITION.BEFOREEND);

const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
renderElement(siteFiltersElement, new FiltersView().getElement(), RENDER_POSITION.BEFOREEND);

const siteEventsElement = document.querySelector('.trip-events');
renderElement(siteEventsElement, new SortView().getElement(), RENDER_POSITION.BEFOREEND);
renderElement(siteEventsElement, new ListOfEventsView().getElement(), RENDER_POSITION.BEFOREEND);

const siteListOfEventsTemplate = siteEventsElement.querySelector('.trip-events__list');
renderTemplate(siteListOfEventsTemplate, createEditEventTemplate(events[0]));

events.slice(1, events.length).forEach((event) => {
  renderElement(siteListOfEventsTemplate, new EventView(event).getElement(), RENDER_POSITION.BEFOREEND);
});
