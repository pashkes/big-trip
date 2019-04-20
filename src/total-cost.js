import Component from "./component";

class TotalCost extends Component {
  constructor(cost) {
    super();
    this._cost = cost;
  }

  get template() {
    return `<p class="trip__total">Total: <span class="trip__total-cost">&euro;&nbsp;${this._cost}</span></p>`;
  }
}

export default TotalCost;
