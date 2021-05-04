import { renderElement, replace } from '../utils/render';
import { RENDER_POSITION } from '../const.js';

export default class Point {
  constructor(tripContainer, point, pointComponent, editPointComponent) {
    this._tripContainer = tripContainer;
    this._point = point;

    this._pointComponent = pointComponent;
    this._editPointComponent = editPointComponent;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setCloseClickHandler(this._handleCloseClick);

    renderElement(this._tripContainer, this._pointComponent.getElement(), RENDER_POSITION.BEFOREEND);
  }

  _handleEditClick() {
    this._replacePointToEditPoint();
  }

  _handleFormSubmit() {
    this._replaceEditPointToPoint();
  }

  _handleCloseClick() {
    this._replaceEditPointToPoint();
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
