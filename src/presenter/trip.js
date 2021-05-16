import PointPresenter from './point';
import { renderElement, RENDER_POSITION } from '../utils/render';
import { SortType, UpdateType, UserAction } from '../const';
import { getDiffOfDates } from '../utils/date.js';

export default class Trip {
  constructor({
    container,
    sortComponent,
    pointsListComponent,
    noPointsComponent,
    pointComponent,
    editPointComponent,
    pointsModel,
  }) {
    this._tripContainer = container;
    this._pointsModel = pointsModel;
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

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
  }

  init() {
    this._renderSort();
    this._renderPointsList();
  }

  _getPoints() {
    const points = this._pointsModel.getPoints().slice();

    switch (this._currentSortType) {
      case SortType.TIME:
        points.sort((p1, p2) => {
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
        points.sort((p1, p2) => {
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

    return points;
  }

  _clearPointList({ resetSortType = false } = {}) {
    Object.values(this._pointPresenter).forEach((point) => point.destroy());
    this._pointPresenter = {};

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
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
