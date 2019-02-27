import template from "./create-event";

const eventContaiter = document.querySelector(`.trip-day__items`);
const renderEvents = ()=> {
  const MAX_CARDS = 7;
  for (let i = 0; i < MAX_CARDS; i++) {
    eventContaiter.insertAdjacentHTML(`beforeend`, template(`Taxi`, `Taxi to Airport`, [`Order UBER +€ 20`, `Upgrade to business +€ 20`]));
  }
};

export default renderEvents;
