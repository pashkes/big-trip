const eventWrapper = document.querySelector(`.trip-day__items`);
const typeEvents = {
  'Taxi': `🚕`,
  'Flight': `✈️`,
  'Drive': `🚗`,
  'Check-in': `🏨`
};
eventWrapper.innerHTML = ``;

const makeOffers = (data) => {
  return data.map((item) => {
    return `<li><button class="trip-point__offer">${item}</button></li>`;
  }).join(``);
};
const makeEvent = (type, name, offers) => {
  const template = `<article class="trip-point">
          <i class="trip-icon">${typeEvents[type]}</i>
          <h3 class="trip-point__title">${name}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
            <span class="trip-point__duration">1h 30m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;20</p>
          <ul class="trip-point__offers">
            ${makeOffers(offers)}
          </ul>
        </article>`;
  eventWrapper.insertAdjacentHTML(`beforeend`, template);
};

export default makeEvent;
