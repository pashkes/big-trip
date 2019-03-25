import Component from "./component";

class Filter extends Component {
  constructor(filter) {
    super();
    this._filter = filter;
    this._onFilter = this._onChangeFilter.bind(this);
  }

  _onChangeFilter(evt) {
    evt.preventDefault();
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `<div>
      <input type="radio" id="${this._filter.id}" name="filter" value="${this._filter.value}" ${this._filter.isChecked ? `checked` : ``}>
      <label class="trip-filter__item" for="${this._filter.id}">${this._filter.name}</label></div>`.trim();
  }

  bind() {
    this._element.addEventListener(`change`, this._onFilter);
  }

  unBind() {
    this._element.removeEventListener(`change`, this._onFilter);
  }
}

export default Filter;
