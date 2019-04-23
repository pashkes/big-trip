import {filterEvents} from "./filter-events";
import {sortEvents} from "./sort-events";

const state = {
  events: null,
  filter: `everything`,
  sort: `event`,
  mode: `default`,
};

const getStateEvents = () => {
  const filtered = filterEvents(state.events, state.filter);
  return sortEvents(filtered, state.sort);
};

export {state, getStateEvents};
