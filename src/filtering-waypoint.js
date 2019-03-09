import renderWaypoint from "./create-waypoint";

const filterList = document.querySelector(`.trip-filter`);

const bindEventRender = () => {
  filterList.addEventListener(`change`, () => {
    renderWaypoint();
  });
};

export default bindEventRender;
