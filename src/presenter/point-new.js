import EditPointView from '../view/edit-point.js';
import { renderElement, remove, RENDER_POSITION } from '../utils/render';
import { UserAction, UpdateType } from '../const.js';

export default class PointNew {
  constructor({ container, changeData }) {
    this._container = container;

    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    this._pointEditComponent = new EditPointView();
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setCloseClickHandler(this._handleCloseClick);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    document.addEventListener('keydown', this._escKeyDownHandler);

    renderElement(this._container, this._pointEditComponent, RENDER_POSITION.AFTERBEGIN);
  }

  destroy() {
    remove(this._pointEditComponent);
    this._pointEditComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleFormSubmit(point) {
    this._changeData(UserAction.ADD_POINT, UpdateType.MINOR, point);
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
