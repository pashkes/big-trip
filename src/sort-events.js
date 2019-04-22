import Sorter from "./sorter";
import {state, getStateEvents} from "./state";

const tripSorting = document.querySelector(`.trip-sorting`);
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

const renderSorts = (sortData, cb) => {
  const fragment = document.createDocumentFragment();

  for (let item of sortData) {
    const sortItem = new Sorter(item);
    sortItem.render();
    sortItem.onChange = (evt) => {
      state.sort = evt.target.value;
      cb(getStateEvents());
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
export {sortEvents, renderSorts};
