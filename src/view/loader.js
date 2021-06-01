import AbstractView from './abstract-view.js';

const createLoaderTemplate = () => {
  return `<p class="trip-events__msg">
    Loading...
  </p>`;
};

export default class Loader extends AbstractView {
  getTemplate() {
    return createLoaderTemplate();
  }
}
