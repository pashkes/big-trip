import {TYPE_EVENTS} from "./data";
import Component from "./component";
import flatpickr from "flatpickr";

class EditWaypoint extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._city = data.city;
    this._timeFrom = data.date.from;
    this._timeTo = data.date.to;
    this._price = data.price;
    this._photos = data.photos;
    // this._offers = data.offers;
    this._description = data.description;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onSubmit = null;
    this._onDelete = this._onDeleteButtonClick.bind(this);
  }

  get template() {
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
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
                  <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
                  <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
                  <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight">
                  <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>

                 <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travel-way" value="Ship" checked>
                  <label class="travel-way__select-label" for="travel-way-flight">🛳️ ship</label>
                </div>

                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
                  <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
                  <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                </div>
              </div>
            </div>

            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">Flight to</label>
              <input class="point__destination-input" list="destination-select" id="destination" value=${this._city} name="destination">
              <datalist id="destination-select">
                <option value="airport"></option>
                <option value="Geneva"></option>
                <option value=${this._city}></option>
                <option value="hotel"></option>
              </datalist>
            </div>

            <label class="point__time">
              choose time
              <input class="point__input range-time" type="text" value="" name="time" placeholder="00:00 — 00:00">
            </label>

            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="${this._price}" name="price">
            </label>

            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button" type="reset">Delete</button>
            </div>

            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
              <label class="point__favorite" for="favorite">favorite</label>
            </div>
          </header>

          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>
              <div class="point__offers-wrap">
                <input class="point__offers-input visually-hidden" type="checkbox" id="add-luggage" name="offer" value="add-luggage">
                <label for="add-luggage" class="point__offers-label">
                  <span class="point__offer-service">Add luggage</span> + €<span class="point__offer-price">30</span>
                </label>

                <input class="point__offers-input visually-hidden" type="checkbox" id="switch-to-comfort-class" name="offer" value="switch-to-comfort-class">
                <label for="switch-to-comfort-class" class="point__offers-label">
                  <span class="point__offer-service">Switch to comfort class</span> + €<span class="point__offer-price">100</span>
                </label>

                <input class="point__offers-input visually-hidden" type="checkbox" id="add-meal" name="offer" value="add-meal">
                <label for="add-meal" class="point__offers-label">
                  <span class="point__offer-service">Add meal </span> + €<span class="point__offer-price">15</span>
                </label>

                <input class="point__offers-input visually-hidden" type="checkbox" id="choose-seats" name="offer" value="choose-seats">
                <label for="choose-seats" class="point__offers-label">
                  <span class="point__offer-service">Choose seats</span> + €<span class="point__offer-price">5</span>
                </label>
              </div>

            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">${this._description}</p>
              <div class="point__destination-images">
                ${this._photos ? this._photos.map((photoSrc) => `<img src="${photoSrc}" alt="picture from place" class="point__destination-image">`).join(``).trim() : ``}
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>`.trim();
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      const formData = new FormData(this._element.querySelector(`form`));
      const updatedEvent = this._processForm(formData);
      updatedEvent.id = this._id;
      this._onSubmit(updatedEvent);
    }
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  _onChangeType(evt) {
    const selectedWay = (this.closest(`.travel-way`)).querySelector(`.travel-way__label`);
    selectedWay.textContent = TYPE_EVENTS[evt.target.value];
  }

  _initDatePicked() {
    flatpickr(this._element.querySelector(`.range-time`), {
      'mode': `range`,
      'enableTime': true,
      'dateFormat': `H:i`,
      'defaultDate': [this._timeFrom, this._timeTo],
      'minDate': `today`,
      'time_24hr': true,
      'appendTo': this._element,
      onChange(selectedDates) {
        this._timeFrom = selectedDates[0];
        this._timeTo = selectedDates[1];
      },
    });
  }

  bind() {
    this._element.addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.addEventListener(`reset`, this._onDelete);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onChangeType);
    this._initDatePicked();
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  _processForm(formData) {
    const entry = {
      type: ``,
      city: ``,
      date: {
        from: this._timeFrom,
        to: this._timeTo,
      },
      price: ``,
      offers: new Set(),
      description: this._description,
      photos: this._photos,
    };
    const editMapper = EditWaypoint.createMapper(entry);
    for (let item of formData.entries()) {
      const [property, value] = item;
      if (editMapper[property]) {
        editMapper[property](value);
      }
    }
    return entry;
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
        target.offers.add(value);
      },
    };

  }

  set onDelete(fn) {
    this._onDelete = fn;
  }
}

export default EditWaypoint;
