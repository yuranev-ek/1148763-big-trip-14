import { createRouteInformationTemplate } from './view/route-information.js';
import { createTotalCostTemplate } from './view/total-cost.js';
import { createMenuTemplate } from './view/menu.js';

const render = (container, template, place = 'beforeend') => {
  if (container) {
    container.insertAdjacentHTML(place, template);
  }
};

const siteMainElement = document.querySelector('.trip-main');
render(siteMainElement, createRouteInformationTemplate(), 'afterbegin');

const siteInfoElement = siteMainElement.querySelector('.trip-main__trip-info');
render(siteInfoElement, createTotalCostTemplate());

const siteMenuElement = siteMainElement.querySelector(
  '.trip-controls__navigation'
);
render(siteMenuElement, createMenuTemplate());
