import Filter from "./filter";
import Waypoint from "./waypoint";
import EditWaypoint from "./edit-waypoint";
import updateData from "./statistics";
import {getMockData, filters, moneyCategories, typesOfTransport} from "./data";
import onClickToggleModeView from "./view-mode";

const mockData = getMockData();
const eventContaiter = document.querySelector(`.trip-day__items`);
const listOfFilter = document.querySelector(`.trip-filter`);

const getCountUsed = (data, statistics) => {
  [...statistics.keys()].forEach((item) => statistics.set(item, 0));
  for (let item of data) {
    if (statistics.has(item.type)) {
      statistics.set(item.type, statistics.get(item.type) + 1);
    }
  }
  return statistics;
};

const getSpentMoney = (data, statistics) => {
  [...statistics.keys()].forEach((item) => statistics.set(item, 0));
  for (let item of data) {
    if (statistics.has(item.type)) {
      statistics.set(item.type, statistics.get(item.type) + item.price);
    }
  }
  return statistics;
};

const getStatistics = (data) => {
  return {
    spentMoney: getSpentMoney(data, moneyCategories),
    wasUsed: getCountUsed(data, typesOfTransport),
  };
};

const updateEvent = (events, index, newEvent) => {
  events[index] = Object.assign({}, events[index], newEvent);
  return events[index];
};

const deleteEvent = (events, index) => {
  events.splice(index, 1);
  return events;
};

const renderEvents = (data) => {
  eventContaiter.innerHTML = ``;
  data.forEach((item, index) => {
    const waypointComponent = new Waypoint(item);
    const openedWaypoint = new EditWaypoint(item);

    waypointComponent.onClick = () => {
      openedWaypoint.render();
      eventContaiter.replaceChild(openedWaypoint.element, waypointComponent._element);
      waypointComponent.destroy();
    };

    openedWaypoint.onSubmit = (newObject) => {
      const update = updateEvent(data, index, newObject);
      waypointComponent.update(update);
      waypointComponent.render();
      eventContaiter.replaceChild(waypointComponent.element, openedWaypoint._element);
      openedWaypoint.destroy();
      updateData(getStatistics(data));
    };

    openedWaypoint.onDelete = () => {
      deleteEvent(data, index);
      updateData(getStatistics(data));
      openedWaypoint.destroy();
      updateData(getStatistics(data));
    };

    waypointComponent.render();
    eventContaiter.appendChild(waypointComponent.element);
  });

  updateData(getStatistics(data));
};

const filterType = (data, events, eventName) => {
  const currentDate = new Date();
  switch (eventName) {
    case `future`:
      return data.filter((it) => it.date.from.getTime() > currentDate.getTime());
    case `past`:
      return data.filter((it) => it.date.from.getTime() < currentDate.getTime());
    default:
      return data;
  }
};

const renderFilters = (filtersData, data) => {
  listOfFilter.innerHTML = ``;
  for (let item of filtersData) {
    const filter = new Filter(item);
    filter.render();

    filter.onFilter = (evt) => {
      eventContaiter.innerHTML = ``;
      const events = filterType(data, filtersData, evt.target.value);
      renderEvents(events);
    };

    listOfFilter.appendChild(filter.element);
  }
};

renderFilters(filters, mockData);
renderEvents(mockData);
onClickToggleModeView();
