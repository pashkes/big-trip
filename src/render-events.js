import template from "./create-event";
import {returnListOfEvents} from "./data";

const eventContaiter = document.querySelector(`.trip-day__items`);

const renderEvents = ()=> {
  const listOfEvent = returnListOfEvents();
  for (let item of listOfEvent) {
    eventContaiter.insertAdjacentHTML(`beforeend`, template(item));
  }
};

export default renderEvents;
