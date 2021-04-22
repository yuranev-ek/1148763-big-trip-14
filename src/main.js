// this isn't a useful line in my life... skip block 3.1, since I completed 3-4 blocks in 4

// templates
import { createRouteInformationTemplate } from './view/route-information.js';
import { createTotalCostTemplate } from './view/total-cost.js';
import { createMenuTemplate } from './view/menu.js';
import { createFiltersTemplate } from './view/filters.js';
import { createSortTemplate } from './view/sort.js';
import { createListOfEventsTemplate } from './view/list-of-events.js';
import { createEditEventTemplate } from './view/edit-event.js';
import { createEventTemplate } from './view/event.js';

// mocks
import { generateEvent } from './mock/event.js';

// utils
import { isAfter } from './utils.js';

const render = (container, template, place = 'beforeend') => {
  if (container) {
    container.insertAdjacentHTML(place, template);
  }
};

const EVENT_COUNT = 15;
const events = new Array(EVENT_COUNT)
  .fill()
  .map(generateEvent)
  .sort((a, b) => {
    return isAfter(a.dateStart, b.dateStart) ? 1 : -1;
  });

const siteHeaderElement = document.querySelector('.trip-main');
render(siteHeaderElement, createRouteInformationTemplate(events), 'afterbegin');

const siteInfoElement = siteHeaderElement.querySelector('.trip-main__trip-info');
render(siteInfoElement, createTotalCostTemplate(events));

const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
render(siteMenuElement, createMenuTemplate());

const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
render(siteFiltersElement, createFiltersTemplate());

const siteEventsElement = document.querySelector('.trip-events');
render(siteEventsElement, createSortTemplate());
render(siteEventsElement, createListOfEventsTemplate());

const siteListOfEventsTemplate = siteEventsElement.querySelector('.trip-events__list');
render(siteListOfEventsTemplate, createEditEventTemplate(events[0]));

events.slice(1, events.length).forEach((event) => render(siteListOfEventsTemplate, createEventTemplate(event)));
