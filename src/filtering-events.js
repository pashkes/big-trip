import templateEvent from "./create-event";
import {returnListOfEvents} from "./data";

const filterList = document.querySelector(`.trip-filter`);
const eventWrapper = document.querySelector(`.trip-day__items`);

const bindEventRender = () => {
  filterList.addEventListener(`change`, () => {
    const listOfEvents = returnListOfEvents();
    const htmlMarkupEvents = listOfEvents.map((item) => templateEvent(item)).join(``);
    eventWrapper.innerHTML = ``;
    eventWrapper.insertAdjacentHTML(`beforeend`, htmlMarkupEvents);
  });
};

export default bindEventRender;
