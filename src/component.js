import {createElement} from "./util";

class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._element = null;
  }

  get template() {
    throw new Error(`You have to define template.`);
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
