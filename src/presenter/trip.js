import PointPresenter from './point';
import { renderElement, RENDER_POSITION } from '../utils/render';
import { updateItem } from '../utils/common.js';

export default class Trip {
  constructor({
    container,
    points = [],
    sortComponent,
    pointsListComponent,
    noPointsComponent,
    pointComponent,
    editPointComponent,
  }) {
    this._tripContainer = container;
    this._sourcedPoints = points.slice();
    this._points = points.slice();
    this._pointPresenter = {};

    this._sortComponent = sortComponent;
    this._pointsListComponent = pointsListComponent;
    this._noPointsComponent = noPointsComponent;
    this._pointComponent = pointComponent;
    this._editPointComponent = editPointComponent;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init() {
    this._renderTrip();
  }

  _renderTrip() {
    this._renderSort();
    this._renderPointsList();
  }

  _renderSort() {
    renderElement(this._tripContainer, this._sortComponent, RENDER_POSITION.BEFOREEND);
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
}
