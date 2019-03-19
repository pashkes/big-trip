
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

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
  bind() {}
  destroy() {
    this._element = null;
  }
  update() {}
  get element() {
    return this._element;
  }
}

export default Component;
