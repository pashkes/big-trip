import template from "./create-event";
import {returnListOfEvents} from "./data";

const eventContaiter = document.querySelector(`.trip-day__items`);

const renderEvents = ()=> {
  const listOfEvent = returnListOfEvents();
  const markupOfEvents = listOfEvent.map((item) => template(item)).join(``);
  eventContaiter.innerHTML = ``;
  eventContaiter.insertAdjacentHTML(`beforeend`, markupOfEvents);
};

export default renderEvents;
