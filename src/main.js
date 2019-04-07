import Filter from "./filter";
import Waypoint from "./waypoint";
import EditWaypoint from "./edit-waypoint";
import updateData from "./statistics";
import {getMockData, filters, STATISTICS, getDestionations} from "./data";
import onClickToggleModeView from "./view-mode";

const eventContaiter = document.querySelector(`.trip-day__items`);
const listOfFilter = document.querySelector(`.trip-filter`);
const state = {
  events: getMockData(),
  filter: `everything`,
};

const getStatistics = (events) => {
  STATISTICS.spentMoney.forEach((item, key) => STATISTICS.spentMoney.set(key, 0));
  STATISTICS.wasUsed.forEach((item, key) => STATISTICS.wasUsed.set(key, 0));
  events.forEach((item) => {
    if (STATISTICS.spentMoney.has(item.type)) {
      STATISTICS.spentMoney.set(item.type, STATISTICS.spentMoney.get(item.type) + item.price);
    }
    if (STATISTICS.wasUsed.has(item.type)) {
      STATISTICS.wasUsed.set(item.type, STATISTICS.wasUsed.get(item.type) + 1);
    }
  });
  return STATISTICS;
};

const updateEvent = (newEvent) => {
  const updatedItemIndex = state.events.findIndex((item) => item.id === newEvent.id);
  return Object.assign(state.events[updatedItemIndex], newEvent);
};

const deleteEvent = (id) => {
  const removedItemIndex = state.events.findIndex((item) => item.id === id);
  const filtered = filterEvents(state.events, state.filter);
  state.events.splice(removedItemIndex, 1);
  renderEvents(filtered);
  updateData(getStatistics(filtered));
};

const onSubmit = (newObject) => {
  const filtered = filterEvents(state.events, state.filter);
  updateEvent(newObject);
  renderEvents(filtered);
  updateData(getStatistics(filtered));
};

const renderEvents = (events) => {
  const fragment = document.createDocumentFragment();

  events.forEach((item) => {
    const waypointComponent = new Waypoint(item);
    const openedWaypoint = new EditWaypoint(item, getDestionations);

    waypointComponent.onClick = () => {
      openedWaypoint.render();
      eventContaiter.replaceChild(openedWaypoint.element, waypointComponent._element);
    };

    openedWaypoint.onSubmit = onSubmit;

    openedWaypoint.onDelete = () => {
      deleteEvent(item.id);
      openedWaypoint.destroy();
      updateData(getStatistics(state.events));
    };

    waypointComponent.render();
    fragment.appendChild(waypointComponent.element);
  });

  eventContaiter.innerHTML = ``;
  eventContaiter.appendChild(fragment);
};

const filterEvents = (events, filterType) => {
  const currentDate = new Date();
  switch (filterType) {
    case `future`:
      return events.filter((it) => it.date.from.getTime() > currentDate.getTime());
    case `past`:
      return events.filter((it) => it.date.from.getTime() < currentDate.getTime());
    default:
      return events;
  }
};

const renderFilters = (filtersData) => {
  const fragment = document.createDocumentFragment();

  for (let item of filtersData) {
    const filter = new Filter(item);
    filter.render();
    filter.onFilter = (evt) => {
      eventContaiter.innerHTML = ``;
      state.filter = evt.target.value;
      const filtered = filterEvents(state.events, state.filter);
      renderEvents(filtered);
      updateData(getStatistics(filtered));
    };

    fragment.appendChild(filter.element);
  }

  listOfFilter.innerHTML = ``;
  listOfFilter.appendChild(fragment);
};

renderFilters(filters);
renderEvents(state.events);
onClickToggleModeView();
