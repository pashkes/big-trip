import {TYPE_EVENTS} from "./data";

const eventWrapper = document.querySelector(`.trip-day__items`);

eventWrapper.innerHTML = ``;
const makeOffers = (data) => {
  return data.map((item) => {
    return `<li><button class="trip-point__offer">${item}</button></li>`;
  }).join(``);
};
const makeEvent = (data) => {
  return `<article class="trip-point">
          <i class="trip-icon">${TYPE_EVENTS[data.type]}</i>
          <h3 class="trip-point__title">${data.name}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${data.time.from}&nbsp;&mdash; ${data.time.to}</span>
            <span class="trip-point__duration">${data.time.duration} H</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${data.price}</p>
          <ul class="trip-point__offers">
            ${makeOffers(data.offers)}
          </ul>
        </article>`;
};

export default makeEvent;
