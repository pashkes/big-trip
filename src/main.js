import renderFilter from "./render-filter";
import renderRandomCards from "./filtering-waypoint";
import Waypoint from "./waypoint";
import EditWaypoint from "./edit-waypoint";
import {generateEvent} from "./data";

renderRandomCards();
renderFilter();
const data = generateEvent();
const eventContaiter = document.querySelector(`.trip-day__items`);
const waypointComponent = new Waypoint(data);
const openedWaypoint = new EditWaypoint(data);

eventContaiter.innerHTML = ``;
waypointComponent.onClick = () => {
  openedWaypoint.render();
  eventContaiter.replaceChild(openedWaypoint.element, waypointComponent._element);
  waypointComponent.destroy();
};

openedWaypoint.onSubmit = (newObject) => {
  data.type = newObject.type;
  data.city = newObject.offers;
  data.date.from = newObject.date.from;
  data.date.to = newObject.date.to;
  data.price = newObject.price;
  data.offers = newObject.offers;
  waypointComponent.update(newObject);
  waypointComponent.render();
  eventContaiter.replaceChild(waypointComponent.element, openedWaypoint._element);
  openedWaypoint.destroy();
};
openedWaypoint.onReset = () => {
  // do something
};
waypointComponent.render();
eventContaiter.appendChild(waypointComponent.element);

