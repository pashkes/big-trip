import template from "./create-event";
import {generateEvent} from "./data";

const eventContaiter = document.querySelector(`.trip-day__items`);
const renderEvents = ()=> {
  const MAX_CARDS = 7;
  for (let i = 0; i < MAX_CARDS; i++) {
    eventContaiter.insertAdjacentHTML(`beforeend`, template(generateEvent()));
  }
};

export default renderEvents;
