// templates
import TotalCostView from './view/total-cost.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import RouteInformationView from './view/route-information.js';

import SortView from './view/sort.js';
import PointsListView from './view/points-list.js';
import PointView from './view/point.js';
import EditPointView from './view/edit-point.js';
import NoPointsView from './view/no-points.js';

import TripPresenter from './presenter/trip.js';

// mocks
import { generatePoint } from './mock/point.js';

// utils
import { isAfter } from './utils/date.js';
import { renderElement } from './utils/render.js';

// const
import { RENDER_POSITION, POINT_COUNT, APP_ELEMENT_CLASSES } from './const.js';

// logic
const points = new Array(POINT_COUNT)
  .fill()
  .map(generatePoint)
  .sort((a, b) => {
    return isAfter(a.dateStart, b.dateStart) ? 1 : -1;
  });

const siteHeaderElement = document.querySelector(APP_ELEMENT_CLASSES.HEADER);
renderElement(siteHeaderElement, new RouteInformationView(points).getElement(), RENDER_POSITION.AFTERBEGIN);
const siteInfoElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.INFO);
renderElement(siteInfoElement, new TotalCostView(points).getElement(), RENDER_POSITION.BEFOREEND);
const siteMenuElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.MENU);
renderElement(siteMenuElement, new MenuView().getElement(), RENDER_POSITION.BEFOREEND);
const siteFiltersElement = siteHeaderElement.querySelector(APP_ELEMENT_CLASSES.FILTERS);
renderElement(siteFiltersElement, new FiltersView().getElement(), RENDER_POSITION.BEFOREEND);

const sitePointsElement = document.querySelector(APP_ELEMENT_CLASSES.POINTS);

const tripPresenter = new TripPresenter({
  container: sitePointsElement,
  sortComponent: new SortView(),
  pointsListComponent: new PointsListView(),
  noPointsComponent: new NoPointsView(),
  pointComponent: PointView,
  editPointComponent: EditPointView,
});

tripPresenter.init(points);
