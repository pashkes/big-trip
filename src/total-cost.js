import Component from "./component";

class TotalCost extends Component {
  constructor(data) {
    super();
    this._cost = TotalCost.countTotalCosts(data);
  }

  get template() {
    return `<p class="trip__total">Total: <span class="trip__total-cost">&euro;&nbsp;${this._cost}</span></p>`;
  }

  static countTotalCosts(events) {
    if (events.length === 1) {
      return events[0].price;
    }
    return events.reduce((a, c) => {
      if (a.price) {
        return a.price + c.price;
      }
      return a + c.price;
    });
  }
}

export default TotalCost;
