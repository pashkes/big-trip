import {FILTERS, SORTS, AUTHORIZATION, END_POINT, ESC_KEY_CODE} from "./constants";
import Event from "./event";
import EventEdit from "./event-edit";
import API from "./api";
import TotalCost from "./total-cost";
import Day from "./day";
import {getCitiesOfList, getOffersOfList} from "./data";
import {updateData, getStatistics} from "./statistics";
import toggleMode from "./view-mode";
import {toRAW} from "./model-event";
import moment from "moment";
import {state, getStateEvents} from "./state";
import {renderSorts} from "./sort-events";
import {renderFilters} from "./filter-events";

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const cities = getCitiesOfList();
const offers = getOffersOfList();
const newEventBtn = document.querySelector(`.new-event`);
const header = document.querySelector(`.trip`);
const points = document.querySelector(`.trip-points`);

const renderEvents = (events) => {
  if (events.length === 0) {
    return;
  }
  const totalCost = new TotalCost(events);
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

const onSubmit = (newObject, component) => {
  component.lockForm();
  api.updateEvent({id: component.id, data: toRAW(newObject)}).then((newEvent) => {
    updateDataEvent(newEvent);
    renderEvents(getStateEvents());
    component.destroy();
    if (state.mode === `creating`) {
      newEventBtn.disabled = !newEventBtn.disabled;
      state.mode = `default`;
    }
  })
    .catch(() => {
      component.unlockForm();
      component.initErrorForm();
    });
};

const onDelete = (component) => {
  api.deleteEvent({id: component.id})
    .then(() => api.getOffers())
    .then(() => {
      deleteEvent(component.id);
      component.destroy();
      if (state.events === null) {
        state.events = [];
      }
      renderEvents(getStateEvents());
    })
    .catch(() => {
      component.unlockForm();
      component.initErrorForm();
    });
  newEventBtn.disabled = false;
};

const onKeyDownEscExit = (element, evt) => {
  if (evt.keyCode === ESC_KEY_CODE) {
    element.destroy();
    renderEvents(getStateEvents());
    if (state.mode === `creating`) {
      newEventBtn.disabled = !newEventBtn.disabled;
      state.mode = `default`;
    }
  }
};

const updateDataEvent = (newEvent) => {
  const updatedItemIndex = state.events.findIndex((item) => item.id === newEvent.id);
  return Object.assign(state.events[updatedItemIndex], newEvent);
};

const deleteEvent = (id) => {
  const removedItemIndex = state.events.findIndex((item) => item.id === id);
  state.events.splice(removedItemIndex, 1);
  if (state.events.length !== 0) {
    renderEvents(getStateEvents());
  }
};

const createEvent = (newObject, component) => {
  component.lockForm();
  api.createEvent(toRAW(newObject)).then((newMadeEvent) => {
    state.events.push(newMadeEvent);
    renderEvents(getStateEvents());
    component.destroy();
    newEventBtn.disabled = !newEventBtn.disabled;
    state.mode = `default`;
  })
    .catch(() => {
      component.unlockForm();
      component.initErrorForm();
    });
};

const newEventClickHandler = (evt) => {
  let idEvent;
  if (state.events === null) {
    idEvent = 0;
  } else {
    idEvent = state.events.length;
  }
  const newEvent = new EventEdit({id: idEvent});
  state.mode = `creating`;
  evt.target.disabled = !evt.target.disabled;
  newEvent.offers = offers;
  newEvent.cities = cities;
  newEvent.onSubmit = createEvent;
  newEvent.onKeyDownEscExit = onKeyDownEscExit;
  points.prepend(newEvent.render());
  newEvent.element.classList.add(`editing`);
  window.scrollTo(0, 0);
};

const getPoints = () => {
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
};

newEventBtn.addEventListener(`click`, newEventClickHandler);
toggleMode();
renderFilters(FILTERS, renderEvents);
renderSorts(SORTS, renderEvents);
getPoints();

