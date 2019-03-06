import renderEvents from "./render-events";

const filterList = document.querySelector(`.trip-filter`);

const bindEventRender = () => {
  filterList.addEventListener(`change`, () => {
    renderEvents();
  });
};

export default bindEventRender;
