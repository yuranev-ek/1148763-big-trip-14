import AbstractView from './abstract-view.js';

const createListOfPointsTemplate = () => {
  return `<ul class="trip-events__list">
          </ul>`;
};

export default class PointsListView extends AbstractView {
  getTemplate() {
    return createListOfPointsTemplate();
  }
}
