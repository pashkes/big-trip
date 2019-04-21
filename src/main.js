import {FILTERS, SORTS, AUTHORIZATION, END_POINT, ESC_KEY_CODE, ANIMATION_DURATION_MC} from "./constants";
import Filter from "./filter";
import Event from "./event";
import EventEdit from "./event-edit";
import API from "./api";
import TotalCost from "./total-cost";
import Day from "./day";
import Sorter from "./sorter";
import {getCitiesOfList, getOffersOfList} from "./data";
import {updateData, getStatistics} from "./statistics";
import onClickToggleModeView from "./view-mode";
import {toRAW} from "./model-event";
import moment from 'moment';

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const cities = getCitiesOfList();
const offers = getOffersOfList();
const listOfFilter = document.querySelector(`.trip-filter`);
const newEventBtn = document.querySelector(`.new-event`);
const header = document.querySelector(`.trip`);
const points = document.querySelector(`.trip-points`);
const tripSorting = document.querySelector(`.trip-sorting`);
const state = {
  events: null,
  filter: `everything`,
  sort: `event`,
};

const renderEvents = (events) => {
  if (events.length === 0) {
    return;
  }
  const totalCost = new TotalCost(countTotalCosts(events));
  const daysOfEvents = events.map((it) => moment(it.dateFrom).format(`DD-MMM-YY`));
  const listOfDays = [...new Set(daysOfEvents)];
  points.innerHTML = ``;
  for (let date of listOfDays) {
    const groupsOfDays = events.filter((it) => moment(it.dateFrom).format(`DD-MMM-YY`) === date);
    const day = new Day(date).render();
    const days = day.querySelector(`.trip-day__items`);
    groupsOfDays.forEach((item) => {
      const event = new Event(item);
      const eventEdit = new EventEdit(item);
      event.onClick = () => {
        eventEdit.onSubmit = onSubmit;
        eventEdit.onKeyDownEscExit = onKeyDownEscExit;
        eventEdit.onDelete = onDelete;
        eventEdit.cities = cities;
        eventEdit.offers = offers;
        eventEdit.render();
        days.replaceChild(eventEdit.element, event.element);
      };
      event.render();
      days.appendChild(event.element);
    });
    points.appendChild(day);
  }

  header.lastElementChild.remove();
  header.appendChild(totalCost.render());
};

const onSubmit = (newObject, event) => {
  const submitBtn = event.element.querySelector(`.point__button--save`);
  const deleteBtn = event.element.querySelector(`.point__button--delete`);

  lockForm(submitBtn, deleteBtn);
  api.updateEvent({id: event.id, data: toRAW(newObject)}).then((newEvent) => {
    const filtered = filterEvents(state.events, state.filter);
    const sort = sortEvents(filtered, state.sort);

    updateDataEvent(newEvent);
    renderEvents(sort);
    getStatistics(filtered, updateData);
    event.destroy();
  })
    .catch(() => {
      unlockForm(submitBtn, deleteBtn);
      initErrorForm(event.element);
    });
};

const onKeyDownEscExit = (element, evt) => {
  if (evt.keyCode === ESC_KEY_CODE) {
    const filtered = filterEvents(state.events, state.filter);
    const sort = sortEvents(filtered, state.sort);

    element.destroy();
    renderEvents(sort);
  }
};

const onDelete = (element) => {
  const submitBtn = element.element.querySelector(`.point__button--save`);
  const deleteBtn = element.element.querySelector(`.point__button--delete`);

  submitBtn.disabled = true;
  deleteBtn.disabled = true;
  deleteBtn.textContent = `Deleting...`;
  api.deleteEvent({id: element.id})
    .then(() => api.getOffers())
    .then(() => {
      deleteEvent(element.id);
      element.destroy();
      if (state.events === null) {
        state.events = [];
      }
      const filtered = filterEvents(state.events, state.filter);
      const sort = sortEvents(filtered, state.sort);
      renderEvents(sort);
      getStatistics(state.events, updateData);
    })
    .catch(() => {
      initErrorForm(element.element);
    });
  newEventBtn.disabled = false;
};

const countTotalCosts = (events) => {
  return [...events.map((it) => +it.price)].reduce((a, c) => a + c);
};

const updateDataEvent = (newEvent) => {
  const updatedItemIndex = state.events.findIndex((item) => item.id === newEvent.id);
  return Object.assign(state.events[updatedItemIndex], newEvent);
};

const deleteEvent = (id) => {
  const removedItemIndex = state.events.findIndex((item) => item.id === id);
  state.events.splice(removedItemIndex, 1);

  if (state.events.length !== 0) {
    const filtered = filterEvents(state.events, state.filter);
    const sort = sortEvents(filtered, state.sort);
    renderEvents(sort);
    getStatistics(filtered, updateData);
  }
};

const lockForm = (submitBtn, deleteBtn) => {
  submitBtn.disabled = true;
  deleteBtn.disabled = true;
  submitBtn.textContent = `Saving...`;
};

const unlockForm = (submitBtn, deleteBtn) => {
  submitBtn.textContent = `Save`;
  submitBtn.disabled = false;
  deleteBtn.disabled = false;
};

const initErrorForm = (form) => {
  form.classList.add(`jello`);
  form.classList.add(`error`);
  setTimeout(() => {
    form.classList.remove(`jello`);
    form.classList.remove(`error`);
  }, ANIMATION_DURATION_MC);
};

const filterEvents = (events, filterType) => {
  if (!events) {
    return false;
  }
  const currentDate = new Date();

  switch (filterType) {
    case `future`:
      return events.filter((it) => it.dateFrom.getTime() > currentDate.getTime());
    case `past`:
      return events.filter((it) => it.dateFrom.getTime() < currentDate.getTime());
    default:
      return events;
  }
};

const onFilter = (evt) => {
  state.filter = evt.target.value;
  const filtered = filterEvents(state.events, state.filter);
  renderEvents(filtered);
};

const renderFilters = (filtersOptions) => {
  const fragment = document.createDocumentFragment();
  for (let item of filtersOptions) {
    const filter = new Filter(item);
    filter.render();
    filter.onFilter = onFilter;
    fragment.appendChild(filter.element);
  }
  listOfFilter.appendChild(fragment);
};

const createEvent = (newObject, event) => {
  const submitBtn = event.element.querySelector(`.point__button--save`);
  const deleteBtn = event.element.querySelector(`.point__button--delete`);
  lockForm(submitBtn, deleteBtn);
  api.createEvent(toRAW(newObject)).then((newMadeEvent) => {
    if (state.events === null) {
      state.events = [];
    }
    state.events.push(newMadeEvent);
    const filtered = filterEvents(state.events, state.filter);
    const sort = sortEvents(filtered, state.sort);
    renderEvents(sort);
    getStatistics(sort, updateData);
    event.destroy();
  })
    .catch(() => {
      unlockForm(submitBtn, deleteBtn);
      initErrorForm(event.element);
    });
};

const newEventClickHandler = () => {
  let idEvent;
  if (state.events === null) {
    idEvent = 0;
  } else {
    idEvent = state.events.length;
  }
  const newEvent = new EventEdit({id: idEvent});
  newEvent.offers = offers;
  newEvent.cities = cities;
  newEvent.onSubmit = createEvent;
  newEvent.onKeyDownEscExit = onKeyDownEscExit;

  points.prepend(newEvent.render());
  newEvent.element.classList.add(`editing`);
  window.scrollTo(0, 0);
};

const sortToTime = (events) => {
  return events.sort((current, next) => {
    const durationCurrent = current.dateTo - current.dateFrom;
    const durationNext = next.dateTo - next.dateFrom;
    return durationCurrent - durationNext;
  });
};

const sortToSpentMoney = (events) => {
  return events.sort((current, next) => current.price - next.price);
};

const renderSorts = (sortData) => {
  const fragment = document.createDocumentFragment();

  for (let item of sortData) {
    const sortItem = new Sorter(item);
    sortItem.render();
    sortItem.onChange = (evt) => {
      const filtered = filterEvents(state.events, state.filter);
      state.sort = evt.target.value;
      const sorted = sortEvents(filtered, state.sort);
      renderEvents(sorted);
    };
    fragment.appendChild(sortItem.element);
  }
  tripSorting.prepend(fragment);
};

const sortEvents = (events, sortType) => {
  if (!events) {
    return false;
  }
  switch (sortType) {
    case `time`:
      return sortToTime(events);
    case `price`:
      return sortToSpentMoney(events);
    default:
      return events;
  }
};

newEventBtn.addEventListener(`click`, newEventClickHandler);
onClickToggleModeView();
renderFilters(FILTERS);
renderSorts(SORTS);
points.innerHTML = `Loading route...`;
api.getPoints()
  .then((events) => {
    if (events.length === 0) {
      points.innerHTML = ``;
    } else {
      renderEvents(events);
      state.events = events;
      getStatistics(events, updateData);
    }
  })
  .catch(() => {
    points.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
