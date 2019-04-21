import Component from "./component";

class Sorter extends Component {
  constructor(sortOption) {
    super();
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
        <input type="radio" name="trip-sorting" id="sorting-${this._value}" value="${this._value}" ${this._checked ? `checked` : ``}>
        <label class="trip-sorting__item trip-sorting__item--${this._value}" for="sorting-${this._value}">${this._value.toUpperCase()}</label>
      </div>`.trim();
  }

  set onChange(fn) {
    this._onChangeRadioSort = fn;
  }

  bind() {
    this.element.addEventListener(`change`, this._onChange);
  }
}

export default Sorter;
