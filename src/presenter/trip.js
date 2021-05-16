import PointPresenter from './point';
import { renderElement, RENDER_POSITION } from '../utils/render';
import { SortType } from '../const';
import { updateItem } from '../utils/common.js';
import { getDiffOfDates } from '../utils/date.js';

export default class Trip {
  constructor({
    container,
    sortComponent,
    pointsListComponent,
    noPointsComponent,
    pointComponent,
    editPointComponent,
  }) {
    this._tripContainer = container;
    this._sourcedPoints = null;
    this._points = null;
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = sortComponent;
    this._pointsListComponent = pointsListComponent;
    this._noPointsComponent = noPointsComponent;
    this._pointComponent = pointComponent;
    this._editPointComponent = editPointComponent;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sourcedPoints = points.slice();
    this._renderSort();
    this._renderPointsList();
  }

  _clearTaskList() {
    Object.values(this._pointPresenter).forEach((point) => point.destroy());
    this._pointPresenter = {};
  }

  _renderSort() {
    renderElement(this._tripContainer, this._sortComponent, RENDER_POSITION.BEFOREEND);
    renderElement(this._tripContainer, this._sortComponent, RENDER_POSITION.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPointsList() {
    renderElement(this._tripContainer, this._pointsListComponent, RENDER_POSITION.BEFOREEND);

    this._points.length ? this._renderPoints() : this._renderNoPoints();
  }

  _renderNoPoints() {
    renderElement(this._tripContainer, this._noPointsComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderPoints() {
    this._points.slice().forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this._pointsListComponent,
      changeData: this._handlePointChange,
      changeMode: this._handleModeChange,
    });
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _handlePointChange(updatedPoint) {
    this._sourcedPoints = updateItem(this._sourcedPoints, updatedPoint);
    this._sourcedBoardTasks = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].destroy();
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((point) => point.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearTaskList();
    this._renderPointsList();
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort((p1, p2) => {
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
        this._points.sort((p1, p2) => {
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
      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }
}
