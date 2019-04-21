import {getStatistics, updateData} from "./statistics";

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
