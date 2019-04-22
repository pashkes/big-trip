import {TYPE_EVENTS} from "./constants";
import Component from "./component";
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

class Event extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._dateFrom = data.dateFrom;
    this._dateTo = data.dateTo;
    this._duration = null;
    this._price = data.price;
    this._offers = data.offers;
    this._city = data.city;
    this._onClick = null;
  }

  get template() {
    const startDate = moment(this._dateFrom);
    const endDate = moment(this._dateTo);
    this._duration = moment.duration(endDate.diff(startDate)).format(`DD[D] h[H] m[M]`);

    return `<article class="trip-point" tabindex="0">
          <i class="trip-icon">${TYPE_EVENTS[this._type].icon}</i>
          <h3 class="trip-point__title">${this._type} ${TYPE_EVENTS[this._type].add} ${this._city}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${startDate.format(`H:mm`)} — ${endDate.format(`H:mm`)}</span>
            <span class="trip-point__duration">${this._duration}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price ? this._price : 0}</p>
          <ul class="trip-point__offers">
          ${this._getOffersTemplate()}
          </ul>
        </article>`.trim();
  }

  _getOffersNames() {
    const filteredOffers = [];
    this._offers.forEach((item, key) => {
      if (item.isChecked) {
        filteredOffers.push(key);
      }
    });
    return filteredOffers;
  }

  _getOffersTemplate() {
    return this._getOffersNames().map((offer) => `<li><button class="trip-point__offer">${offer}</button></li>`).join(``);
  }

  bind() {
    this._element.addEventListener(`click`, this._onClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onClick);
  }

  set onClick(func) {
    this._onClick = func;
  }
}

export default Event;
