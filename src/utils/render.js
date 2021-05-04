import { RENDER_POSITION } from '../const.js';

export const renderElement = (container, element, place) => {
  switch (place) {
    case RENDER_POSITION.AFTERBEGIN:
      container.prepend(element);
      break;
    case RENDER_POSITION.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const replace = (newChild, oldChild) => {
  const parent = oldChild.parentElement;
  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};
