import Filter from "./filter";
import {state, getStateEvents} from "./state";

const listOfFilter = document.querySelector(`.trip-filter`);

const filterEvents = (events, filterType) => {
  if (!events) {
    return false;
  }
  const currentDate = new Date();
  switch (filterType) {
    case `future`:
      return events.filter((it) => {
        return it.dateFrom > currentDate;
      });
    case `past`:
      return events.filter((it) => {
        return it.dateFrom < currentDate;
      });
    default:
      return [...events];
  }
};

const renderFilters = (filtersOptions, cb) => {
  const fragment = document.createDocumentFragment();
  for (let item of filtersOptions) {
    const filter = new Filter(item);
    filter.render();
    filter.onFilter = (evt) => {
      state.filter = evt.target.value;
      cb(getStateEvents());
    };
    fragment.appendChild(filter.element);
  }
  listOfFilter.appendChild(fragment);
};

export {filterEvents, renderFilters};
