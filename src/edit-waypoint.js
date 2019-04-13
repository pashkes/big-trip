import {TYPE_EVENTS} from "./data";
import Component from "./component";
import flatpickr from "flatpickr";

class EditWaypoint extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._city = data.city;
    this._timeFrom = data.dateFrom;
    this._timeTo = data.dateTo;
    this._price = data.price;
    this._offers = data.offers;
    this._photos = data.photos;
    this._description = data.description;
    this._isFavorite = data.isFavorite;
    this._onChangeType = this._onChangeRadioType.bind(this);
    this._onSearch = this._onFocusInputSearch.bind(this);
    this._onChangeCity = this._onChangeInputCity.bind(this);
    this._initDatePickerStartDate = null;
    this._initDatePickerEndDate = null;
    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDelete = this._onDeleteButtonClick.bind(this);
  }

  get template() {
    const getOffers = () => {
      const result = [];
      this._offers.forEach((item, key) => {
        result.push(this.offerTemplate(key, item.price, item.isChecked));
      });
      return result.join(``);
    };
    return `
      <article class="point">
        <form action="" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="MAR 18" name="day">
            </label>

            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle">${TYPE_EVENTS[this._type]}</label>

              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

              <div class="travel-way__select">
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi" checked>
                  <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
                  <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
                  <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight">
                  <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travel-way" value="ship">
                  <label class="travel-way__select-label" for="travel-way-ship">🛳️ ship</label>
                </div>

                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
                  <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sightseeing">
                  <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                </div>
              </div>
            </div>

            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">Flight to</label>
              <input class="point__destination-input" list="destination-select" id="destination" value="${this._city ? this._city : ``}" name="destination">
              <datalist id="destination-select"></datalist>
            </div>

            <label class="point__time">
              choose time
              <input class="point__input" type="text" value="19:00" name="date-start" placeholder="19:00">
              <input class="point__input" type="text" value="21:00" name="date-end" placeholder="21:00">
            </label>

            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="${this._price ? this._price : 0}" name="price">
            </label>

            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button" type="reset">Delete</button>
            </div>

            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
              <label class="point__favorite" for="favorite">favorite</label>
            </div>
          </header>

          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>
              <div class="point__offers-wrap">
                ${getOffers()}
              </div>
            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">${this._description ? this._description : ``}</p>
              <div class="point__destination-images">
                ${this._photos ? this._photos.map((photo) => `<img src="${photo.src}" alt="${photo.description}" class="point__destination-image">`).join(``).trim() : ``}
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>`.trim();
  }

  offerTemplate(value, price, isChecked = false) {
    const id = value.split(` `).join(`-`);

    return `<div>
              <input class="point__offers-input visually-hidden" type="checkbox" id="${id}" name="offer" value="${value}" ${isChecked ? `checked` : ``}>
              <label for="${id}" class="point__offers-label">
                <span class="point__offer-service">${value}</span> + €<span class="point__offer-price">${price}</span>
              </label>
            </div>`.trim();
  }

  _onChangeRadioType() {
    if (typeof this._onChangeType !== `function`) {
      return;
    }
    this._onChangeType();
  }

  _onChangeInputCity() {
    if (typeof this._onChangeCity !== `function`) {
      return;
    }
    this._onChangeCity();
  }

  _onFocusInputSearch() {
    if (typeof this._onSearch !== `function`) {
      return;
    }
    this._onSearch();
  }

  _initDatePickers() {
    const formElements = this._element.querySelector(`form`).elements;
    const startDate = formElements[`date-start`];
    const endDate = formElements[`date-end`];
    const self = this;
    this._initDatePickerStartDate = flatpickr(startDate, {
      'enableTime': true,
      'dateFormat': `H:i`,
      'defaultDate': this._timeFrom,
      'time_24hr': true,
      'noCalendar': true,
      onClose(selectedDates) {
        self._timeFrom = selectedDates[0];
      },
    });
    this._initDatePickerEndDate = flatpickr(endDate, {
      'enableTime': true,
      'dateFormat': `H:i`,
      'defaultDate': this._timeTo,
      'time_24hr': true,
      'noCalendar': true,
      onClose(selectedDates) {
        self._timeTo = selectedDates[0];
      },
    });
  }

  _destroyDatePickers() {
    this._initDatePickerStartDate.destroy();
    this._initDatePickerEndDate.destroy();
  }

  _onSubmitButtonClick(evt) {
    if (typeof this._onSubmit !== `function`) {
      return;
    }
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`form`));
    const updatedEvent = this._processForm(formData);
    updatedEvent.id = this._id;
    this._onSubmit(updatedEvent, this);
  }

  _onDeleteButtonClick(evt) {
    if (typeof this._onDelete !== `function`) {
      return;
    }
    evt.preventDefault();
    this._onDelete();
  }

  _processForm(formData) {
    this._offers.forEach((item) => {
      item.isChecked = false;
    });
    const entry = {
      type: ``,
      city: ``,
      dateFrom: this._timeFrom,
      dateTo: this._timeTo,
      price: ``,
      offers: this._offers,
      description: this._description,
      photos: this._photos,
      isFavorite: false
    };
    const editMapper = EditWaypoint.createMapper(entry);
    for (let [property, value] of formData.entries()) {
      if (editMapper[property]) {
        editMapper[property](value);
      }
    }
    return entry;
  }

  bind() {
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onChangeType);
    this._element.querySelector(`.point__destination-input`).addEventListener(`focus`, this._onSearch);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeCity);
    this._element.addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.addEventListener(`reset`, this._onDelete);
    this._initDatePickers();
  }

  unbind() {
    this._element.removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.removeEventListener(`reset`, this._onDelete);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onChangeType);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`focus`, this._onSearch);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeCity);
    this._destroyDatePickers();
  }

  set onChangeType(fn) {
    this._onChangeType = fn;
  }

  set onSearch(fn) {
    this._onSearch = fn;
  }

  set onChangeCity(fn) {
    this._onChangeCity = fn;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  static createMapper(target) {
    return {
      'travel-way': (value) => {
        target.type = value;
      },
      'destination': (value) => {
        target.city = value;
      },
      'price': (value) => {
        target.price = +value;
      },
      'offer': (value) => {
        target.offers.set(value, {isChecked: true, price: (target.offers.get(value)).price});
      },
      'favorite': (value) => {
        target.isFavorite = !!value;
      }
    };
  }
}

export default EditWaypoint;
