// templates
import TotalCostView from './view/total-cost.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import RouteInformationView from './view/route-information.js';
import ListOfEventsView from './view/list-of-events.js';
import EventView from './view/event.js';
import EditEventView from './view/edit-event.js';
import NoEventView from './view/no-events.js';

// mocks
import { generateEvent } from './mock/event.js';

// utils
import { isAfter } from './utils/date.js';
import { renderElement, replaceElement } from './utils/render.js';

// const
import { RENDER_POSITION, EVENT_COUNT, APP_ELEMENT_CLASSES } from './const.js';

// logic
const events = new Array(EVENT_COUNT)
  .fill()
  .map(generateEvent)
  .sort((a, b) => {
    return isAfter(a.dateStart, b.dateStart) ? 1 : -1;
  });

const siteHeaderElement = document.querySelector(APP_ELEMENT_CLASSES.HEADER);
renderElement(siteHeaderElement, new RouteInformationView(events), RENDER_POSITION.AFTERBEGIN);

const siteInfoElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.INFO);
renderElement(siteInfoElement, new TotalCostView(events), RENDER_POSITION.BEFOREEND);

const siteMenuElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.MENU);
renderElement(siteMenuElement, new MenuView(), RENDER_POSITION.BEFOREEND);

const siteFiltersElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.FILTERS);
renderElement(siteFiltersElement, new FiltersView(), RENDER_POSITION.BEFOREEND);

const siteEventsElement = document.querySelector(APP_ELEMENT_CLASSES.EVENTS);
renderElement(siteEventsElement, new SortView(), RENDER_POSITION.BEFOREEND);
renderElement(siteEventsElement, new ListOfEventsView(), RENDER_POSITION.BEFOREEND);

const siteListOfEventsTemplate = siteEventsElement.querySelector(APP_ELEMENT_CLASSES.LIST_OF_EVENTS);

const renderEvent = (event) => {
  const eventElement = new EventView(event);
  const editEventElement = new EditEventView(event);

  const replaceEventToEditEvent = () => {
    replaceElement(editEventElement, eventElement);
  };

  const replaceEditEventToEvent = () => {
    replaceElement(eventElement, editEventElement);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditEventToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onClose = () => {
    replaceEditEventToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onOpen = () => {
    replaceEventToEditEvent();
    document.addEventListener('keydown', onEscKeyDown);
  };

  eventElement.setEditClickHandler(onOpen);

  editEventElement.setFormSubmitHandler(onClose);

  editEventElement.setCloseClickHandler(onClose);

  renderElement(siteListOfEventsTemplate, eventElement, RENDER_POSITION.BEFOREEND);
};

if (events.length) {
  events.forEach((event) => renderEvent(event));
} else {
  renderElement(siteEventsElement, new NoEventView(), RENDER_POSITION.BEFOREEND);
}
