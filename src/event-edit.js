import {TYPE_EVENTS, WAY_OF_GROUPS} from "./constants";
import Component from "./component";
import flatpickr from "flatpickr";
import {createElement, makeImage} from "./util";

class EventEdit extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type || `taxi`;
    this._city = data.city || ``;
    this._timeFrom = data.dateFrom || new Date();
    this._timeTo = data.dateTo || new Date();
    this._price = data.price || 0;
    this._offers = data.offers || new Map();
    this._photos = data.photos || [];
    this._description = data.description || ``;
    this._isFavorite = data.isFavorite || false;
    this._allOffers = new Map();
    this._cities = new Map();
    this._onKeyDown = null;
    this._initDatePickerStartDate = null;
    this._initDatePickerEndDate = null;
    this._onSubmit = null;
    this._onDelete = null;
    this._onChangeRadioType = this._onChangeRadioType.bind(this);
    this._onChangeOffers = this._onChangeOffers.bind(this);
    this._onFocusInputSearch = this._onFocusInputSearch.bind(this);
    this._onChangeInputCity = this._onChangeInputCity.bind(this);
    this._onKeyDownEsc = this._onKeyDownEsc.bind(this);
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
  }

  get id() {
    if (this._id === undefined) {
      throw new Error(`You have to define template.`);
    }
    return this._id;
  }

  get template() {
    return `
      <article class="point animated fast">
        <form action="" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="MAR 18" name="day">
            </label>

            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle">${TYPE_EVENTS[this._type].icon}</label>
              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

              <div class="travel-way__select">
                <div class="travel-way__select-group">
                 ${this._getTravelWayTemplate(WAY_OF_GROUPS.TRASPORT)}
                </div>
                <div class="travel-way__select-group">
                  ${this._getTravelWayTemplate(WAY_OF_GROUPS.PLACES)}
                </div>
              </div>
            </div>

            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">${this._type} ${TYPE_EVENTS[this._type].add}</label>
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
              <button class="point__button point__button--delete" type="reset">Delete</button>
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
                ${this._getOffersNames()}
              </div>
            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">${this._description ? this._description : ``}</p>
              <div class="point__destination-images">
                ${this._getPhotosTemplate()}
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>`.trim();
  }

  _getOffersNames() {
    const offers = [];
    this._offers.forEach((item, key) => {
      offers.push(this._getOfferTemplate(key, item.price, item.isChecked));
    });
    return offers.join(``);
  }

  _getOfferTemplate(value, price, isChecked = false) {
    const id = value.split(` `).join(`-`);
    return `<div>
              <input class="point__offers-input visually-hidden" type="checkbox" id="${id}" name="offer" value="${value}" ${isChecked ? `checked` : ``}>
              <label for="${id}" class="point__offers-label">
                <span class="point__offer-service">${value}</span> + €<span class="point__offer-price">${price}</span>
              </label>
            </div>`.trim();
  }

  _getTravelWayTemplate(ways) {
    return ways.map((item) => {
      return `<input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${item}" name="travel-way" value="${item}" ${this._type === item ? `checked` : ``}>
          <label class="travel-way__select-label" for="travel-way-${item}">${TYPE_EVENTS[item].icon} ${item}</label>`.trim();
    }).join(``);
  }

  _getPhotosTemplate() {
    return this._photos ? this._photos.map((photo) => `<img src="${photo.src}" alt="${photo.description}" class="point__destination-image">`.trim()).join(``) : ``;
  }

  _onChangeRadioType(evt) {
    const offfers = this._element.querySelector(`.point__offers-wrap`);
    const selectedWay = this._element.querySelector(`.travel-way__label`);
    const totalPrice = this._element.querySelector(`.point__price input`);
    const destinationLabel = this._element.querySelector(`.point__destination-label`);
    const toggleDropdown = this._element.querySelector(`.travel-way__toggle `);

    const hasKey = this._allOffers.has(evt.target.value);
    selectedWay.textContent = TYPE_EVENTS[evt.target.value].icon;
    destinationLabel.textContent = `${evt.target.value} ${TYPE_EVENTS[evt.target.value].add}`;
    toggleDropdown.checked = false;
    if (!hasKey) {
      return;
    }
    const targetType = this._allOffers.get(evt.target.value);
    const fragmentForOffers = document.createDocumentFragment();

    totalPrice.value = this._price;
    this._offers.clear();
    targetType.forEach((offer) => {
      const offerTemplate = this._getOfferTemplate(offer.name, offer.price);
      fragmentForOffers.appendChild(createElement(offerTemplate));
      this._offers.set(offer.name, {price: offer.price, isChecked: false});
    });
    offfers.innerHTML = ``;
    offfers.appendChild(fragmentForOffers);
  }

  _onChangeOffers(evt) {
    const totalPrice = this._element.querySelector(`.point__price input`);
    const isChecked = evt.target.checked;
    const hasKey = this._offers.has(evt.target.value);
    const selectedOffer = evt.target.value;
    let getPriceOfOffer;

    if (isChecked && hasKey) {
      getPriceOfOffer = this._offers.get(selectedOffer).price;
      totalPrice.value = +totalPrice.value + getPriceOfOffer;
    } else {
      getPriceOfOffer = this._offers.get(selectedOffer).price;
      totalPrice.value = +totalPrice.value - getPriceOfOffer;
    }
  }

  _onChangeInputCity(evt) {
    const pictures = this._element.querySelector(`.point__destination-images`);
    const description = this._element.querySelector(`.point__destination-text`);

    if (!this._cities.has(evt.target.value)) {
      return;
    }
    const targetCity = this._cities.get(evt.target.value);
    const fragment = document.createDocumentFragment();

    description.textContent = targetCity.description;
    this._description = targetCity.description;
    this._photos = targetCity.pictures;
    targetCity.pictures.forEach((picture) => {
      fragment.appendChild(makeImage(picture.src, picture.alt, `point__destination-image`));
    });
    pictures.innerHTML = ``;
    pictures.appendChild(fragment);
  }

  _onFocusInputSearch() {
    const datalist = this._element.querySelector(`datalist`);
    const citiesFragment = document.createDocumentFragment();
    for (let [key] of this._cities) {
      citiesFragment.appendChild(createElement(`<option value="${key}">`));
    }
    datalist.appendChild(citiesFragment);
  }

  _onKeyDownEsc(evt) {
    if (typeof this._onKeyDown !== `function`) {
      return;
    }
    this._onKeyDown(this, evt);
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
      onClose(selectedDates) {
        self._timeFrom = selectedDates[0];
      },
    });
    this._initDatePickerEndDate = flatpickr(endDate, {
      'enableTime': true,
      'dateFormat': `H:i`,
      'defaultDate': this._timeTo,
      'time_24hr': true,
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
    const formData = new FormData(evt.target);
    const updatedEvent = this._processForm(formData);
    updatedEvent.id = this._id;

    this._lockForm();
    this._onSubmit(updatedEvent, this, evt);
  }

  _onDeleteButtonClick(evt) {
    if (typeof this._onDelete !== `function`) {
      return;
    }
    evt.preventDefault();
    this._deletingData();
    this._onDelete(this);
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
      isFavorite: false,
    };
    const editMapper = EventEdit.createMapper(entry);
    for (let [property, value] of formData.entries()) {
      if (editMapper[property]) {
        editMapper[property](value);
      }
    }
    return entry;
  }

  _lockForm() {
    const submitBtn = this._element.querySelector(`.point__button--save`);
    const deleteBtn = this._element.querySelector(`.point__button--delete`);
    submitBtn.disabled = true;
    deleteBtn.disabled = true;
    submitBtn.textContent = `Saving...`;
  }

  _deletingData() {
    const submitBtn = this._element.querySelector(`.point__button--save`);
    const deleteBtn = this._element.querySelector(`.point__button--delete`);
    submitBtn.disabled = true;
    deleteBtn.disabled = true;
    deleteBtn.textContent = `Deleting...`;
  }

  bind() {
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onChangeRadioType);
    this._element.querySelector(`.point__destination-input`).addEventListener(`focus`, this._onFocusInputSearch);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeInputCity);
    this._element.querySelector(`.point__offers-wrap`).addEventListener(`change`, this._onChangeOffers);
    this._element.addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.addEventListener(`reset`, this._onDeleteButtonClick);
    document.addEventListener(`keydown`, this._onKeyDownEsc);
    this._initDatePickers();
  }

  unbind() {
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onChangeRadioType);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`focus`, this._onFocusInputSearch);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeInputCity);
    this._element.querySelector(`.point__offers-wrap`).removeEventListener(`change`, this._onChangeOffers);
    this._element.removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.removeEventListener(`reset`, this._onDeleteButtonClick);
    document.removeEventListener(`keydown`, this._onKeyDownEsc);
    this._destroyDatePickers();
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onKeyDownEscExit(fn) {
    this._onKeyDown = fn;
  }

  set offers(offers) {
    this._allOffers = offers;
  }

  set cities(cities) {
    this._cities = cities;
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
      },
    };
  }
}

export default EventEdit;
