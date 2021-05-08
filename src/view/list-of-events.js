import AbstractView from './abstract-view.js';

const createListOfEventsTemplate = () => {
  return `<ul class="trip-events__list">
          </ul>`;
};

export default class ListOfEvents extends AbstractView {
  getTemplate() {
    return createListOfEventsTemplate();
  }
}
