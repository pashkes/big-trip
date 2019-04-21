import {createElement} from "./util";

class Component {
  constructor() {
    this._id = undefined;
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._element = null;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  get id() {
    if (this._id === undefined) {
      throw new Error(`You have to define template.`);
    }
    return this._id;
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {
  }

  unbind() {
  }

  destroy() {
    this._element.remove();
    this.unbind();
    this._element = null;
  }

  get element() {
    return this._element;
  }
}

export default Component;
