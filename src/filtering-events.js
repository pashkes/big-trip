import templateEvent from "./create-event";
import {returnListOfEvents} from "./data";

const filterList = document.querySelector(`.trip-filter`);
const eventWrapper = document.querySelector(`.trip-day__items`);

const bindEventRender = () => {
  filterList.addEventListener(`change`, () => {
    const listOfEvents = returnListOfEvents();
    eventWrapper.innerHTML = ``;
    for (let item of listOfEvents) {
      eventWrapper.insertAdjacentHTML(`beforeend`, templateEvent(item));
    }
  });
};

export default bindEventRender;
