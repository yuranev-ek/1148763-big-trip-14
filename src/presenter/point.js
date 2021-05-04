import PointView from '../view/point.js';
import EditPointView from '../view/edit-point.js';
import { renderElement, replace, remove } from '../utils/render';
import { RENDER_POSITION } from '../const.js';

export default class Point {
  constructor({ container, changeData }) {
    this._container = container;
    this._point = null;

    this._changeData = changeData;

    this._pointComponent = null;
    this._editPointComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    this._pointComponent = new PointView(point);
    this._editPointComponent = new EditPointView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setCloseClickHandler(this._handleCloseClick);

    renderElement(this._container, this._pointComponent.getElement(), RENDER_POSITION.BEFOREEND);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  _handleEditClick() {
    this._replacePointToEditPoint();
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceEditPointToPoint();
  }

  _handleCloseClick() {
    this._replaceEditPointToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign({}, this._point, {
        isFavorite: !this._point.isFavorite,
      })
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceEditPointToPoint();
    }
  }

  _replacePointToEditPoint() {
    replace(this._editPointComponent.getElement(), this._pointComponent.getElement());
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceEditPointToPoint() {
    replace(this._pointComponent.getElement(), this._editPointComponent.getElement());
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }
}
