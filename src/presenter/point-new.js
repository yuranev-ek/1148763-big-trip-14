import EditPointView from '../view/point-edit.js';
import { renderElement, remove, RENDER_POSITION } from '../utils/render';
import { UserAction, UpdateType } from '../const.js';

export default class PointNew {
  constructor({ container, changeData }) {
    this._container = container;

    this._changeData = changeData;

    this._pointNewComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    this._pointNewComponent = new EditPointView();
    this._pointNewComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointNewComponent.setCloseClickHandler(this._handleCloseClick);
    this._pointNewComponent.setDeleteClickHandler(this._handleDeleteClick);

    document.addEventListener('keydown', this._escKeyDownHandler);

    renderElement(this._container, this._pointNewComponent, RENDER_POSITION.AFTERBEGIN);
  }

  destroy() {
    remove(this._pointNewComponent);
    this._pointNewComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointNewComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointNewComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointNewComponent.shake(resetFormState);
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
