import {Waypoint} from "./waypoint";
import {generateEvent} from "./data";
import EditWaypoint from "./edit-waypoint";

const eventContaiter = document.querySelector(`.trip-day__items`);
const waypointComponent = new Waypoint(generateEvent());
const openedWaypoint = new EditWaypoint(generateEvent());

const renderWaipoint = () => {
  eventContaiter.innerHTML = ``;
  waypointComponent.render();
  eventContaiter.appendChild(waypointComponent.element);

  waypointComponent.onClick = () => {
    openedWaypoint.render();
    eventContaiter.replaceChild(openedWaypoint.element, waypointComponent.element);
    openedWaypoint.unrender();
  };

  openedWaypoint.onSubmit = () => {
    waypointComponent.render();
    eventContaiter.replaceChild(waypointComponent.element, openedWaypoint.element);
    waypointComponent.unrender();
  };

};

export default renderWaipoint;

