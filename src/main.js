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

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

// mocks
import { generatePoint } from './mock/point.js';

// utils
import { renderElement, RENDER_POSITION, remove } from './utils/render.js';

// const
import { POINT_COUNT, APP_ELEMENT_CLASSES } from './const.js';

// logic
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(APP_ELEMENT_CLASSES.HEADER);
renderElement(siteHeaderElement, new RouteInformationView(points), RENDER_POSITION.AFTERBEGIN);
const siteInfoElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.INFO);
renderElement(siteInfoElement, new TotalCostView(points), RENDER_POSITION.BEFOREEND);
const siteMenuElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.MENU);

const siteMenuComponent = new MenuView();
let statisticsComponent = null;
renderElement(siteMenuElement, siteMenuComponent, RENDER_POSITION.BEFOREEND);
const siteFiltersElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.FILTERS);

const sitePointsElement = document.querySelector(APP_ELEMENT_CLASSES.POINTS);

const tripPresenter = new TripPresenter({
  container: sitePointsElement,
  sortComponent: new SortView(),
  pointsListComponent: new PointsListView(),
  noPointsComponent: new NoPointsView(),
  pointComponent: PointView,
  editPointComponent: EditPointView,
  pointsModel,
  filterModel,
});
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

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

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
