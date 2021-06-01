import MenuView, { MenuItem } from './view/menu.js';
import SortView from './view/sort.js';
import PointsListView from './view/points-list.js';
import PointView from './view/point.js';
import EditPointView from './view/point-edit.js';
import EmptyPointListView from './view/empty-point-list';
import StatisticsView from './view/statistics.js';
import LoaderView from './view/loader.js';
import TotalCostView from './view/total-cost.js';
import RouteInformationView from './view/route-information.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import { renderElement, RenderPosition, remove } from './utils/render.js';
import { AppElementClasses, UpdateType } from './const.js';
import { getToken } from './utils/auth.js';

import Api from './api.js';

const AUTHORIZATION = `Basic ${getToken()}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector(AppElementClasses.HEADER);
const siteMenuElement = siteHeaderElement.querySelector(AppElementClasses.MENU);
const siteMenuComponent = new MenuView();
let statisticsComponent = null;
const siteFiltersElement = siteHeaderElement.querySelector(AppElementClasses.FILTERS);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TRIP:
      remove(statisticsComponent);
      tripPresenter.init();
      break;
    case MenuItem.STATISTICS:
      tripPresenter.resetFilterAndSort();
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      renderElement(sitePointsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const renderRouteInformation = (points) => {
  renderElement(siteHeaderElement, new RouteInformationView(points), RenderPosition.AFTERBEGIN);
  const siteInfoElement = siteHeaderElement.querySelector(AppElementClasses.INFO);
  renderElement(siteInfoElement, new TotalCostView(points), RenderPosition.BEFOREEND);
};

const sitePointsElement = document.querySelector(AppElementClasses.POINTS);

const pointsModel = new PointsModel();
const api = new Api(END_POINT, AUTHORIZATION);
let defaultDestinations = [];
let defaultOffers = [];

api.getDestinations().then((destinationsData) => {
  defaultDestinations = destinationsData;
});

api.getOffers().then((offersData) => {
  defaultOffers = offersData;
});

api
  .getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    renderRouteInformation(points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    renderRouteInformation([]);
  })
  .finally(() => {
    renderElement(siteMenuElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  container: sitePointsElement,
  sortComponent: new SortView(),
  pointsListComponent: new PointsListView(),
  emptyPointListComponent: new EmptyPointListView(),
  loaderComponent: new LoaderView(),
  pointComponent: PointView,
  editPointComponent: EditPointView,
  pointsModel,
  filterModel,
  api,
});
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector(AppElementClasses.NEW_EVENT_BUTTON).addEventListener('click', (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(MenuItem.TRIP);
  siteMenuComponent.setMenuItem(MenuItem.TRIP);
  tripPresenter.createPoint();
});

export { defaultDestinations, defaultOffers };
