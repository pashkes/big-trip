import {Waypoint} from "./waypoint";
import {generateEvent} from "./data";
import EditWaypoint from "./edit-waypoint";

const eventContaiter = document.querySelector(`.trip-day__items`);
const waypointComponent = new Waypoint(generateEvent());
const openedWaypoint = new EditWaypoint(generateEvent());

const renderWaipoint = () => {
  eventContaiter.innerHTML = ``;
  eventContaiter.appendChild(waypointComponent.render());
  waypointComponent.bind = ()=> {
    waypointComponent.onClick = ()=> {
      openedWaypoint.render();
      eventContaiter.replaceChild(openedWaypoint.element, waypointComponent.element);
    };
  };
};

export default renderWaipoint;
