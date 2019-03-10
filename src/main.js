import renderFilter from "./render-filter";
import renderRandomCards from "./filtering-waypoint";
import {Waypoint} from "./waypoint";
import EditWaypoint from "./edit-waypoint";
import {generateEvent} from "./data";

renderRandomCards();
renderFilter();

const eventContaiter = document.querySelector(`.trip-day__items`);
const waypointComponent = new Waypoint(generateEvent());
const openedWaypoint = new EditWaypoint(generateEvent());

eventContaiter.innerHTML = ``;
waypointComponent.onClick = () => {
  openedWaypoint.render();
  eventContaiter.replaceChild(openedWaypoint._element, waypointComponent._element);
};

openedWaypoint.onSubmit = (evt) => {
  evt.preventDefault();
  waypointComponent.render();
  eventContaiter.replaceChild(waypointComponent._element, openedWaypoint._element);
};
openedWaypoint.onReset = () => {
  // do something
};
waypointComponent.render();
eventContaiter.appendChild(waypointComponent._element);

