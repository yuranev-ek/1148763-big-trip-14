import TotalCostView from './view/total-cost.js';
import MenuView, { MenuItem } from './view/menu.js';
import RouteInformationView from './view/route-information.js';

import SortView from './view/sort.js';
import PointsListView from './view/points-list.js';
import PointView from './view/point.js';
import EditPointView from './view/point-edit.js';
import NoPointsView from './view/no-points.js';
import StatisticsView from './view/statistics.js';
import LoadingView from './view/loading.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import { renderElement, RenderPosition, remove } from './utils/render.js';
import { AppElementClasses, UpdateType } from './const.js';
import { generateToken } from './utils/common.js';

import Api from './api.js';

// todo: возможно необходимо будет почистить от ненужных элементов в header

let token = localStorage.getItem('token');
if (token == undefined) {
  localStorage.setItem('token', generateToken());
  token = localStorage.getItem('token');
}
const AUTHORIZATION = `Basic ${token}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const points = [];
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(AppElementClasses.HEADER);
renderElement(siteHeaderElement, new RouteInformationView(points), RenderPosition.AFTERBEGIN);
const siteInfoElement = siteHeaderElement.querySelector(AppElementClasses.INFO);
renderElement(siteInfoElement, new TotalCostView(points), RenderPosition.BEFOREEND);
const siteMenuElement = siteHeaderElement.querySelector(AppElementClasses.MENU);

const siteMenuComponent = new MenuView();
let statisticsComponent = null;
const siteFiltersElement = siteHeaderElement.querySelector(AppElementClasses.FILTERS);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TRIP:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      renderElement(sitePointsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const sitePointsElement = document.querySelector(AppElementClasses.POINTS);

const pointsModel = new PointsModel();
const api = new Api(END_POINT, AUTHORIZATION);
export let defaultDestinations = [];
export let defaultOffers = [];

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
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  })
  .finally(() => {
    renderElement(siteMenuElement, siteMenuComponent, RenderPosition.BEFOREEND);
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

document.querySelector(AppElementClasses.NEW_EVENT_BUTTON).addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
