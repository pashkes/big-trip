import Component from "./component";

class Filter extends Component {
  constructor(filters) {
    super();
    this._value = filters.value;
    this._isChecked = filters.checked;
    this._onFilter = this._onChangeFilter.bind(this);
  }

  _onChangeFilter(evt) {
    if (typeof this._onFilter === `function`) {
      window.scrollTo(0, 0);
      this._onFilter(evt);
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `<div>
      <input type="radio" id="filter-${this._value}" name="filter" value="${this._value}" ${this._isChecked ? `checked` : ``}>
      <label class="trip-filter__item" for="filter-${this._value}">${this._value.toUpperCase()}</label></div>`.trim();
  }

  bind() {
    this._element.addEventListener(`change`, this._onFilter);
  }

  unbind() {
    this._element.removeEventListener(`change`, this._onFilter);
  }
}

export default Filter;
