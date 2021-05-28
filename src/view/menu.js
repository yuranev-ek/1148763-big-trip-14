import AbstractView from './abstract-view.js';

export const MenuItem = {
  TRIP: 'trip',
  STATISTICS: 'statistics',
};

export const createMenuTemplate = () => {
  return `
    <div class="trip-controls__navigation">
        <h2 class="visually-hidden">Switch trip view</h2>
        <nav class="trip-controls__trip-tabs  trip-tabs">
          <a data-tab=${MenuItem.TRIP} class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
          <a data-tab=${MenuItem.STATISTICS} class="trip-tabs__btn" href="#">Stats</a>
        </nav>
    </div>
    `;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._tabs = null;
    this._currentTab = MenuItem.TRIP;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const tabName = evt.target.dataset.tab;
    if (tabName !== this._currentTab) {
      this._handlers.menuClick(tabName);
      this.setMenuItem(tabName);
    }
  }

  setMenuClickHandler(callback) {
    this._handlers.menuClick = callback;
    this._tabs = this.getElement().querySelectorAll('.trip-tabs__btn');
    if (this._tabs) {
      this._tabs.forEach((tab) => {
        tab.addEventListener('click', this._menuClickHandler);
      });
    }
  }

  setMenuItem(tabName) {
    if (this._tabs !== null) {
      this._tabs.forEach((tab) => {
        const isActive = tab.dataset.tab === tabName;
        tab.classList.toggle('trip-tabs__btn--active', isActive);
        if (isActive) {
          this._currentTab = tabName;
        }
      });
    }
  }
}
