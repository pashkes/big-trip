import templateEvent from "./create-event";

const MAX_AMOUNT_CARDS = 16;
const filterList = document.querySelector(`.trip-filter`);
const eventWrapper = document.querySelector(`.trip-day__items`);

const bindEventRender = () => {
  filterList.addEventListener(`change`, () => {
    const randomNumber = Math.ceil(Math.random() * MAX_AMOUNT_CARDS);
    eventWrapper.innerHTML = ``;
    for (let i = 0; i < randomNumber; i++) {
      eventWrapper.insertAdjacentHTML(`beforeend`, templateEvent(`Taxi`, `Taxi to Airport`, [`Order UBER +€ 20`, `Upgrade to business +€ 20`]));
    }
  });
};

export default bindEventRender;
