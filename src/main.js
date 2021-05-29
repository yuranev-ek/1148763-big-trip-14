// templates
import TotalCostView from './view/total-cost.js';
import MenuView, { MenuItem } from './view/menu.js';
import RouteInformationView from './view/route-information.js';

import SortView from './view/sort.js';
import PointsListView from './view/points-list.js';
import PointView from './view/point.js';
import EditPointView from './view/edit-point.js';
import NoPointsView from './view/no-points.js';
import StatisticsView from './view/statistics.js';
import LoadingView from './view/loading.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import { renderElement, RENDER_POSITION, remove } from './utils/render.js';
import { APP_ELEMENT_CLASSES, UpdateType } from './const.js';
import { generateToken } from './utils/common.js';

import Api from './api.js';

let token = localStorage.getItem('token');
if (token == undefined) {
  localStorage.setItem('token', generateToken());
  token = localStorage.getItem('token');
}
const AUTHORIZATION = `Basic ${token}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const points = [];
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(APP_ELEMENT_CLASSES.HEADER);
renderElement(siteHeaderElement, new RouteInformationView(points), RENDER_POSITION.AFTERBEGIN);
const siteInfoElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.INFO);
renderElement(siteInfoElement, new TotalCostView(points), RENDER_POSITION.BEFOREEND);
const siteMenuElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.MENU);

const siteMenuComponent = new MenuView();
let statisticsComponent = null;
const siteFiltersElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.FILTERS);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TRIP:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      renderElement(sitePointsElement, statisticsComponent, RENDER_POSITION.BEFOREEND);
      break;
  }
};

const sitePointsElement = document.querySelector(APP_ELEMENT_CLASSES.POINTS);

const pointsModel = new PointsModel();
const api = new Api(END_POINT, AUTHORIZATION);

api
  .getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  })
  .finally(() => {
    renderElement(siteMenuElement, siteMenuComponent, RENDER_POSITION.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

const tripPresenter = new TripPresenter({
  container: sitePointsElement,
  sortComponent: new SortView(),
  pointsListComponent: new PointsListView(),
  noPointsComponent: new NoPointsView(),
  loadingComponent: new LoadingView(),
  pointComponent: PointView,
  editPointComponent: EditPointView,
  pointsModel,
  filterModel,
  api,
});
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector(APP_ELEMENT_CLASSES.NEW_EVENT_BUTTON).addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
