import {FILTERS, SORTS, AUTHORIZATION, END_POINT, ESC_KEY_CODE, ANIMATION_DURATION} from "./constants";
import Event from "./event";
import EventEdit from "./event-edit";
import API from "./api";
import TotalCost from "./total-cost";
import Day from "./day";
import {getCitiesOfList, getOffersOfList} from "./data";
import {updateData, getStatistics} from "./statistics";
import onClickToggleModeView from "./view-mode";
import {toRAW} from "./model-event";
import moment from "moment";
import {state, getCurrentStateEvents} from "./state";
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
        eventEdit.onSubmit = (newObject) => {
          const submitBtn = eventEdit.element.querySelector(`.point__button--save`);
          const deleteBtn = eventEdit.element.querySelector(`.point__button--delete`);
          api.updateEvent({id: eventEdit.id, data: toRAW(newObject)}).then((newEvent) => {
            updateDataEvent(newEvent);
            renderEvents(getCurrentStateEvents());
            getStatistics(getCurrentStateEvents(), updateData);
            eventEdit.destroy();
            if (state.mode === `creating`) {
              newEventBtn.disabled = !newEventBtn.disabled;
              state.mode = `default`;
            }
          })
            .catch(() => {
              unlockForm(submitBtn, deleteBtn);
              initErrorForm(event.element);
            });
        };
        eventEdit.onKeyDownEscExit = onKeyDownEscExit;
        eventEdit.onDelete = () => {
          const submitBtn = eventEdit.element.querySelector(`.point__button--save`);
          const deleteBtn = eventEdit.element.querySelector(`.point__button--delete`);
          api.deleteEvent({id: eventEdit.id})
            .then(() => api.getOffers())
            .then(() => {
              deleteEvent(eventEdit.id);
              eventEdit.destroy();
              if (state.events === null) {
                state.events = [];
              }
              renderEvents(getCurrentStateEvents());
              getStatistics(state.events, updateData);
            })
            .catch(() => {
              unlockForm(submitBtn, deleteBtn);
              initErrorForm(eventEdit.element);
            });
          newEventBtn.disabled = false;
        };
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

const onKeyDownEscExit = (element, evt) => {
  if (evt.keyCode === ESC_KEY_CODE) {
    element.destroy();
    renderEvents(getCurrentStateEvents());
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
    renderEvents(getCurrentStateEvents());
    getStatistics(getCurrentStateEvents(), updateData);
  }
};

const unlockForm = (submitBtn, deleteBtn) => {
  submitBtn.textContent = `Save`;
  deleteBtn.textContent = `Delete`;
  submitBtn.disabled = false;
  deleteBtn.disabled = false;
};

const initErrorForm = (form) => {
  form.classList.add(`jello`);
  form.classList.add(`error`);
  setTimeout(() => {
    form.classList.remove(`jello`);
    form.classList.remove(`error`);
  }, ANIMATION_DURATION);
};

const createEvent = (newObject, event) => {
  const submitBtn = event.element.querySelector(`.point__button--save`);
  const deleteBtn = event.element.querySelector(`.point__button--delete`);
  api.createEvent(toRAW(newObject)).then((newMadeEvent) => {
    if (state.events === null) {
      state.events = [];
    }
    state.events.push(newMadeEvent);
    renderEvents(getCurrentStateEvents());
    getStatistics(getCurrentStateEvents(), updateData);
    event.destroy();
    newEventBtn.disabled = !newEventBtn.disabled;
    state.mode = `default`;
  })
    .catch(() => {
      unlockForm(submitBtn, deleteBtn);
      initErrorForm(event.element);
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

newEventBtn.addEventListener(`click`, newEventClickHandler);
onClickToggleModeView();
renderFilters(FILTERS, renderEvents);
renderSorts(SORTS, renderEvents);
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
