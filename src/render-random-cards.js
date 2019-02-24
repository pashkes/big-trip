import renderEvent from "./event";

const bindEventRender = () => {
  const filterList = document.querySelector(`.trip-filter`);
  const eventWrapper = document.querySelector(`.trip-day__items`);
  const maxAmountCards = 16;
  filterList.addEventListener(`change`, () => {
    const randomNumber = Math.ceil(Math.random() * maxAmountCards);
    let initialNumber = 0;
    eventWrapper.innerHTML = ``;
    while (initialNumber < randomNumber) {
      renderEvent(`Taxi`, `Taxi to Airport`, [`Order UBER +€ 20`, `Upgrade to business +€ 20`]);
      initialNumber++;
    }
  });
};
bindEventRender();

export default bindEventRender;
