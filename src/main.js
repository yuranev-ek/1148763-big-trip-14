// templates
import TotalCostView from './view/total-cost.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import RouteInformationView from './view/route-information.js';
import ListOfEventsView from './view/list-of-events.js';
import EventView from './view/event.js';
import EditEventView from './view/edit-event.js';

// mocks
import { generateEvent } from './mock/event.js';

// utils
import { isAfter } from './utils/date.js';
import { renderElement, replace } from './utils/render.js';

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
renderElement(siteHeaderElement, new RouteInformationView(events).getElement(), RENDER_POSITION.AFTERBEGIN);

const siteInfoElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.INFO);
renderElement(siteInfoElement, new TotalCostView(events).getElement(), RENDER_POSITION.BEFOREEND);

const siteMenuElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.MENU);
renderElement(siteMenuElement, new MenuView().getElement(), RENDER_POSITION.BEFOREEND);

const siteFiltersElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.FILTERS);
renderElement(siteFiltersElement, new FiltersView().getElement(), RENDER_POSITION.BEFOREEND);

const siteEventsElement = document.querySelector(APP_ELEMENT_CLASSES.EVENTS);
renderElement(siteEventsElement, new SortView().getElement(), RENDER_POSITION.BEFOREEND);
renderElement(siteEventsElement, new ListOfEventsView().getElement(), RENDER_POSITION.BEFOREEND);

const siteListOfEventsTemplate = siteEventsElement.querySelector(APP_ELEMENT_CLASSES.LIST_OF_EVENTS);

const renderEvent = (event) => {
  const eventElement = new EventView(event);
  const editEventElement = new EditEventView(event);

  const replaceEventToEditEvent = () => {
    replace(editEventElement.getElement(), eventElement.getElement());
  };

  const replaceEditEventToEvent = () => {
    replace(eventElement.getElement(), editEventElement.getElement());
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

  eventElement.setEditClickHandler(() => onOpen());

  editEventElement.setFormSubmitHandler(() => onClose());

  editEventElement.setCloseClickHandler(() => onClose());

  renderElement(siteListOfEventsTemplate, eventElement.getElement(), RENDER_POSITION.BEFOREEND);
};

events.forEach((event) => renderEvent(event));
