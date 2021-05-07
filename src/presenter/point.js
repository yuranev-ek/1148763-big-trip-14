import PointView from '../view/point.js';
import EditPointView from '../view/edit-point.js';
import { renderElement, replaceElement, remove, RENDER_POSITION } from '../utils/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
export default class Point {
  constructor({ container, changeData, changeMode }) {
    this._container = container;
    this._point = null;

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

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

    renderElement(this._container, this._pointComponent, RENDER_POSITION.BEFOREEND);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditPointToPoint();
    }
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
    const isFavorite = { isFavorite: !this._point.isFavorite };
    this._changeData(Object.assign({}, this._point, isFavorite));
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceEditPointToPoint();
    }
  }

  _replacePointToEditPoint() {
    replaceElement(this._editPointComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditPointToPoint() {
    replaceElement(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }
}
