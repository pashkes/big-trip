import {TYPE_EVENTS} from "./data";
import Component from "./component";

class Waypoint extends Component {
  constructor(data) {
    super();
    this._type = TYPE_EVENTS[data.type];
    this._name = data.name;
    this._timeFrom = data.time.from;
    this._timeTo = data.time.to;
    this._duration = data.time.duration;
    this._price = data.price;
    this._offers = data.offers;

    this._onClick = null;
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._type}</i>
          <h3 class="trip-point__title">${this._name}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this._timeFrom}&nbsp;&mdash; ${this._timeTo}</span>
            <span class="trip-point__duration">${this._duration} H</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this._offers.map((item) => `<li><button class="trip-point__offer">${item}</button></li>`).join(``)}
          </ul>
        </article>`;
  }

  bind() {
    this._element.addEventListener(`click`, this._onClick);
  }

  set onClick(func) {
    this._onClick = func;
  }
}

export default Waypoint;
