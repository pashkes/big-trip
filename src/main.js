import Filter from "./filter";
import Waypoint from "./waypoint";
import EditWaypoint from "./edit-waypoint";
import {getMockData} from "./data";

const filters = [
  {
    id: `filter-everything`,
    name: `Everything`,
    isChecked: true,
    value: `everything`,
  },
  {
    id: `filter-filter-future`,
    name: `Future`,
    isChecked: false,
    value: `future`,
  },
  {
    id: `filter-past`,
    name: `Past`,
    isChecked: false,
    value: `past`,
  },
];
const mockData = getMockData();
const eventContaiter = document.querySelector(`.trip-day__items`);
const listOfFilter = document.querySelector(`.trip-filter`);

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
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    const waypointComponent = new Waypoint(item);
    const openedWaypoint = new EditWaypoint(item);

    waypointComponent.onClick = () => {
      openedWaypoint.render();
      eventContaiter.replaceChild(openedWaypoint.element, waypointComponent._element);
      waypointComponent.destroy();
    };

    openedWaypoint.onSubmit = (newObject) => {
      const update = updateEvent(data, i, newObject);
      waypointComponent.update(update);
      waypointComponent.render();
      eventContaiter.replaceChild(waypointComponent.element, openedWaypoint._element);
      openedWaypoint.destroy();
    };

    openedWaypoint.onDelete = () => {
      deleteEvent(data, i);
      openedWaypoint.destroy();
    };

    waypointComponent.render();
    eventContaiter.appendChild(waypointComponent.element);
  }
};

const filterEvents = (events, eventName) => {
  const currentdate = new Date();

  switch (eventName) {
    case `filter-filter-future`:
      return mockData.filter((it) => it.date.from.getTime() > currentdate.getTime());
    case `filter-past`:
      return mockData.filter((it) => it.date.from.getTime() < currentdate.getTime());
    default:
      return mockData;
  }
};

const renderFilters = () => {
  listOfFilter.innerHTML = ``;
  for (let item of filters) {
    const filter = new Filter(item);
    filter.render();

    filter.onFilter = () => {
      eventContaiter.innerHTML = ``;
      const id = (filter.element.querySelector(`input`)).id;
      const filteredEvents = filterEvents(filters, id);
      renderEvents(filteredEvents);
    };

    listOfFilter.appendChild(filter.element);
  }
};

renderFilters();
renderEvents(mockData);
