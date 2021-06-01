import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import { renderElement, RenderPosition, remove } from '../utils/render.js';
import { SortType, UpdateType, UserAction, AppElementClasses, State as PointPresenterViewState } from '../const.js';
import { getDiffOfDates } from '../utils/date.js';
import { filter } from '../utils/filter.js';
import { isAfter } from '../utils/date.js';

export default class Trip {
  constructor({
    container,
    sortComponent,
    pointsListComponent,
    emptyPointListComponent,
    pointComponent,
    editPointComponent,
    loaderComponent,
    pointsModel,
    filterModel,
    api,
  }) {
    this._tripContainer = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._api = api;

    this._sortComponent = sortComponent;
    this._pointsListComponent = pointsListComponent;
    this._emptyPointListComponent = emptyPointListComponent;
    this._pointComponent = pointComponent;
    this._editPointComponent = editPointComponent;
    this._loaderComponent = loaderComponent;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter({
      container: this._pointsListComponent,
      changeData: this._handleViewAction,
    });
  }

  init() {
    this._renderSort();
    this._renderPointsList();

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearPointList({ resetSortType: true });

    remove(this._pointsListComponent);
    remove(this._sortComponent);
    remove(this._loaderComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this.resetFilterAndSort();
    this._pointNewPresenter.init();
  }

  resetFilterAndSort() {
    this._filterModel.setFilter(UpdateType.MAJOR);
    this._currentSortType = SortType.DAY;
    this._sortComponent.changeSortInput(this._currentSortType);
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
      this._sortComponent.changeSortInput(this._currentSortType);
    }
  }

  _renderSort() {
    renderElement(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPointsList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    renderElement(this._tripContainer, this._pointsListComponent, RenderPosition.BEFOREEND);

    const points = this._getPoints();
    points && points.length ? this._renderPoints() : this._renderNoPoints();
  }

  _renderNoPoints() {
    renderElement(this._tripContainer, this._emptyPointListComponent, RenderPosition.BEFOREEND);
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
    this._sortComponent.changeSortInput(this._currentSortType);
    this._clearPointList();
    this._renderPointsList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api
          .updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api
          .addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api
          .deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update.id);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loaderComponent);
        this._renderPointsList();
        break;
    }

    this._clearPointList({ resetSortType: true });
    this._renderPointsList();
  }

  _renderLoading() {
    const containerElement = document.querySelector(AppElementClasses.POINTS);
    renderElement(containerElement, this._loaderComponent, RenderPosition.BEFOREEND);
  }
}
