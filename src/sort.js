import Component from "./component";

class Sort extends Component {
  constructor(sortOption) {
    super();
    this._id = sortOption.id;
    this._value = sortOption.value;
    this._checked = sortOption.isChecked;
    this._onChange = this._onChangeRadioSort.bind(this);
  }

  _onChangeRadioSort(evt) {
    if (typeof this._onChangeRadioSort === `function`) {
      this._onChangeRadioSort(evt);
    }
  }

  get template() {
    return `
      <div>
        <input type="radio" name="trip-sorting" id="${this._id}" value="${this._value}" ${this._checked ? `checked` : ``}>
        <label class="trip-sorting__item trip-sorting__item--${this._value}" for="${this._id}">${this._value}</label>
      </div>`.trim();
  }

  set onChange(fn) {
    this._onChangeRadioSort = fn;
  }

  bind() {
    this.element.addEventListener(`change`, this._onChange);
  }
}

export default Sort;
