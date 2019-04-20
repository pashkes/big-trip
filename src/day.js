import Component from './component.js';
import moment from 'moment';

class Day extends Component {
  constructor(data) {
    super();

    this._day = moment(data).format(`D`);
    this._monthAndYear = moment(data).format(`MMM YY`);
  }

  get template() {
    return `
    <section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">${this._day}</p>
        <h2 class="trip-day__title">${this._monthAndYear}</h2>
      </article>
      <div class="trip-day__items">
      </div>
    </section>`.trim();
  }
}

export default Day;
