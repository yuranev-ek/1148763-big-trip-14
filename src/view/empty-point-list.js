import AbstractView from './abstract-view.js';

const createEmptyPointListTemplate = () => {
  return `<p class="trip-events__msg">
  Click New Event to create your first point
  </p>`;
};

export default class EmptyPointList extends AbstractView {
  getTemplate() {
    return createEmptyPointListTemplate();
  }
}
