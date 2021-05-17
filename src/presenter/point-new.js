import EditPointView from '../view/edit-point.js';
import { renderElement, remove, RENDER_POSITION } from '../utils/render';
import { generateId } from '../mock/point.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointNew {
  constructor({ container, changeData }) {
    this._container = container;

    this._changeData = changeData;

    this._editPointComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    this._editPointComponent = new EditPointView();
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setCloseClickHandler(this._handleCloseClick);
    this._editPointComponent.setDeleteClickHandler(this._handleDeleteClick);

    document.addEventListener('keydown', this._escKeyDownHandler);

    renderElement(this._container, this._editPointComponent, RENDER_POSITION.AFTERBEGIN);
  }

  destroy() {
    remove(this._editPointComponent);
    this._editPointComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleFormSubmit(point) {
    this._changeData(UserAction.ADD_POINT, UpdateType.MINOR, Object.assign(point, { id: generateId() }));
    this.destroy();
  }

  _handleCloseClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
