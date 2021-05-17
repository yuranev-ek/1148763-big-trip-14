import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import { renderElement, RENDER_POSITION } from '../utils/render.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { getDiffOfDates } from '../utils/date.js';
import { filter } from '../utils/filter.js';
import { isAfter } from '../utils/date.js';

export default class Trip {
  constructor({
    container,
    sortComponent,
    pointsListComponent,
    noPointsComponent,
    pointComponent,
    editPointComponent,
    pointsModel,
    filterModel,
  }) {
    this._tripContainer = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._sortComponent = sortComponent;
    this._pointsListComponent = pointsListComponent;
    this._noPointsComponent = noPointsComponent;
    this._pointComponent = pointComponent;
    this._editPointComponent = editPointComponent;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter({
      container: this._pointsListComponent,
      changeData: this._handleViewAction,
    });
  }

  init() {
    this._renderSort();
    this._renderPointsList();
  }

  createPoint() {
    this._filterModel.setFilter(UpdateType.MAJOR);
    this._currentSortType = SortType.DAY;
    this._sortComponent.changeCurrentSortType(this._currentSortType);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints().slice();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        filteredPoints.sort((a, b) => {
          return isAfter(a.dateStart, b.dateStart) ? 1 : -1;
        });
        break;
      case SortType.TIME:
        filteredPoints.sort((p1, p2) => {
          const diffMinutesOfPoint1 = getDiffOfDates(p1.dateEnd, p1.dateStart, 'minute');
          const diffMinutesOfPoint2 = getDiffOfDates(p2.dateEnd, p2.dateStart, 'minute');

          if (diffMinutesOfPoint1 > diffMinutesOfPoint2) {
            return -1;
          }

          if (diffMinutesOfPoint1 < diffMinutesOfPoint2) {
            return 1;
          }

          if (diffMinutesOfPoint1 === diffMinutesOfPoint2) {
            return 0;
          }

          return null;
        });
        break;
      case SortType.PRICE:
        filteredPoints.sort((p1, p2) => {
          const price1 = p1.basePrice;
          const price2 = p2.basePrice;

          if (price1 > price2) {
            return -1;
          }

          if (price1 < price2) {
            return 1;
          }

          if (price1 === price2) {
            return 0;
          }

          return null;
        });
        break;
    }

    return filteredPoints;
  }

  _clearPointList({ resetSortType = false } = {}) {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((point) => point.destroy());
    this._pointPresenter = {};

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
      this._sortComponent.changeCurrentSortType(this._currentSortType);
    }
  }

  _renderSort() {
    renderElement(this._tripContainer, this._sortComponent, RENDER_POSITION.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPointsList() {
    renderElement(this._tripContainer, this._pointsListComponent, RENDER_POSITION.BEFOREEND);

    const points = this._getPoints();
    points && points.length ? this._renderPoints() : this._renderNoPoints();
  }

  _renderNoPoints() {
    renderElement(this._tripContainer, this._noPointsComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderPoints() {
    this._getPoints()
      .slice()
      .forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this._pointsListComponent,
      changeData: this._handleViewAction,
      changeMode: this._handleModeChange,
    });
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((point) => point.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._sortComponent.changeCurrentSortType(this._currentSortType);
    this._clearPointList();
    this._renderPointsList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearPointList();
        this._renderPointsList();
        break;
      case UpdateType.MAJOR:
        this._clearPointList({ resetSortType: true });
        this._renderPointsList();
        break;
    }

    this._clearPointList({ resetSortType: true });
    this._renderPointsList();
  }
}
