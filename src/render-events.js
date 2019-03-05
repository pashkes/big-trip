import template from "./create-event";
import {returnListOfEvents} from "./data";

const eventContaiter = document.querySelector(`.trip-day__items`);

const renderEvents = ()=> {
  const listOfEvent = returnListOfEvents();
  const htmlEvents = listOfEvent.map((item) => template(item)).join(``);
  eventContaiter.insertAdjacentHTML(`beforeend`, htmlEvents);
};

export default renderEvents;
