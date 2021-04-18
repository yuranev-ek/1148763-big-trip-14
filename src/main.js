// templates
import { createRouteInformationTemplate } from './view/route-information.js';
import { createMenuTemplate } from './view/menu.js';
import { createFiltersTemplate } from './view/filters.js';
import { createSortTemplate } from './view/sort.js';
import { createListOfEventsTemplate } from './view/list-of-events.js';
import { createEditEventTemplate } from './view/edit-event.js';
import { createEventTemplate } from './view/event.js';
import TotalCostView from './view/total-cost.js';

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
renderTemplate(siteHeaderElement, createRouteInformationTemplate(events), 'afterbegin');

const siteInfoElement = siteHeaderElement.querySelector('.trip-main__trip-info');
renderElement(siteInfoElement, new TotalCostView(events).getElement(), RENDER_POSITION.BEFOREEND);

const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
renderTemplate(siteMenuElement, createMenuTemplate());

const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
renderTemplate(siteFiltersElement, createFiltersTemplate());

const siteEventsElement = document.querySelector('.trip-events');
renderTemplate(siteEventsElement, createSortTemplate());
renderTemplate(siteEventsElement, createListOfEventsTemplate());

const siteListOfEventsTemplate = siteEventsElement.querySelector('.trip-events__list');
renderTemplate(siteListOfEventsTemplate, createEditEventTemplate(events[0]));

events.slice(1, events.length).forEach((event) => renderTemplate(siteListOfEventsTemplate, createEventTemplate(event)));
