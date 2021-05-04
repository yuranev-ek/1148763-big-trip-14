import PointPresenter from './point';
import { renderElement } from '../utils/render';
import { RENDER_POSITION } from '../const';

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
  }

  init() {
    this._renderTrip();
  }

  _renderTrip() {
    this._renderSort();
    this._renderPointsList();
  }

  _renderSort() {
    renderElement(this._tripContainer, this._sortComponent.getElement(), RENDER_POSITION.BEFOREEND);
  }

  _renderPointsList() {
    renderElement(this._tripContainer, this._pointsListComponent.getElement(), RENDER_POSITION.BEFOREEND);

    this._points.length ? this._renderPoints() : this._renderNoPoints();
  }

  _renderNoPoints() {
    renderElement(this._tripContainer, this._noPointsComponent.getElement(), RENDER_POSITION.BEFOREEND);
  }

  _renderPoints() {
    this._points.slice().forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointsList = this._pointsListComponent.getElement();
    const pointElement = new this._pointComponent(point);
    const editPointElement = new this._editPointComponent(point);

    const pointPresenter = new PointPresenter(pointsList, point, pointElement, editPointElement);
    pointPresenter.init();
  }
}
