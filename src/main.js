import Filter from "./filter";
import Waypoint from "./waypoint";
import EditWaypoint from "./edit-waypoint";
import {getMockData} from "./data";
import updateData from "./statistic";

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
const viewMode = document.querySelectorAll(`.view-switch__item`);
const mockData = getMockData();
const eventContaiter = document.querySelector(`.trip-day__items`);
const listOfFilter = document.querySelector(`.trip-filter`);

const moneyCategories = [`flight`, `check-in`, `Drive`, `sight-seeing`, `Restaurant`, `taxi`];

const transport = {
  'train': {
    used: 0
  },
  'Transport': {
    used: 0,
  },
  'Ship': {
    used: 0
  },
  'bus': {
    used: 0
  },
};


const getSpentMoney = (data) => {
  const resultData = [];
  for (let item of moneyCategories) {
    const hasKey = data.some((it) => it.type === item);
    if (hasKey) {
      const filter = data.filter((it) => it.type === item).map((it) => it.price);
      resultData.push(filter.reduce((a, c) => c + a));
    } else {
      resultData.push(0);
    }
  }
  return resultData;
};

const getCountUsed = (data) => {
  const keys = Object.keys(transport);
  for (let key of keys) {
    data.forEach((it) => {
      if (it.type === key) {
        transport[key].used += 1;
      }
    });
  }
};

const onClickToggleModeView = () => {
  viewMode.forEach((item) => {
    item.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const target = evt.target;
      const previousModeLink = document.querySelector(`.view-switch__item--active`);
      const lastHash = previousModeLink.hash.substring(1);
      const currentHash = target.hash.substring(1);
      const previousModeElement = document.querySelector(`#${lastHash}`);
      const targetElement = document.querySelector(`#${currentHash}`);
      previousModeLink.classList.remove(`view-switch__item--active`);
      targetElement.classList.remove(`visually-hidden`);
      previousModeElement.classList.add(`visually-hidden`);
      target.classList.add(`view-switch__item--active`);
    });
  });
};
const transfromData = (data) => {
  return getSpentMoney(data);
  // getCountUsed(data);
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
      updateData(transfromData(data));
    };

    openedWaypoint.onDelete = () => {
      deleteEvent(data, i);
      openedWaypoint.destroy();
      updateData(transfromData(data));
    };

    waypointComponent.render();
    eventContaiter.appendChild(waypointComponent.element);
  }
  updateData(transfromData(data));
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
onClickToggleModeView();
