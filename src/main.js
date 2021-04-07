import { createRouteInformationTemplate } from './view/route-information.js';
import { createTotalCostTemplate } from './view/total-cost.js';
import { createMenuTemplate } from './view/menu.js';
import { createFiltersTemplate } from './view/filters.js';
import { createSortTemplate } from './view/sort.js';
import { createListOfEventsTemplate } from './view/list-of-events.js';
import { createEditEventTemplate } from './view/edit-event.js';

const render = (container, template, place = 'beforeend') => {
  if (container) {
    container.insertAdjacentHTML(place, template);
  }
};

const siteHeaderElement = document.querySelector('.trip-main');
render(siteHeaderElement, createRouteInformationTemplate(), 'afterbegin');

const siteInfoElement = siteHeaderElement.querySelector(
  '.trip-main__trip-info'
);
render(siteInfoElement, createTotalCostTemplate());

const siteMenuElement = siteHeaderElement.querySelector(
  '.trip-controls__navigation'
);
render(siteMenuElement, createMenuTemplate());

const siteFiltersElement = siteHeaderElement.querySelector(
  '.trip-controls__filters'
);
render(siteFiltersElement, createFiltersTemplate());

const siteEventsElement = document.querySelector('.trip-events');
render(siteEventsElement, createSortTemplate());
render(siteEventsElement, createListOfEventsTemplate());

const siteListOfEventsTemplate = siteEventsElement.querySelector(
  '.trip-events__list'
);
render(siteListOfEventsTemplate, createEditEventTemplate());
