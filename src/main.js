import Filter from "./filter";
import Waypoint from "./waypoint";
import EditWaypoint from "./edit-waypoint";
import updateData from "./statistics";
import {filters, STATISTICS, TYPE_EVENTS, sorts} from "./data";
import onClickToggleModeView from "./view-mode";
import API from "./api";
import {createElement} from "./util";
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import TotalCost from "./total-cost";
import Day from "./day";
import Sort from "./sort";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yiZAo=1sdy7dd7svs084`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;
const ESC_KEY_CODE = 27;
const ANIMATION_DURATION_MC = 800;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const destinations = api.getDestination();
const getOffers = api.getOffers();
const offers = new Map();
const citiesList = new Map();
const eventContaiter = document.querySelector(`.trip-day__items`);
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

momentDurationFormatSetup(moment);

destinations.then((cities) => {
  cities.forEach((city) => {
    citiesList.set(city.name, {description: city.description, pictures: [...city.pictures]});
  });
});

getOffers.then((list) => list.forEach((item) => {
  offers.set(item.type, item.offers);
}));

const getStatistics = (events) => {
  const currentDate = new Date();
  STATISTICS.spentMoney.forEach((item, key) => STATISTICS.spentMoney.set(key, 0));
  STATISTICS.wasUsed.forEach((item, key) => STATISTICS.wasUsed.set(key, 0));
  STATISTICS.spentTime.forEach((item, key) => STATISTICS.spentTime.set(key, 0));

  // сначало получение законченых событий
  events.filter((it) => it.dateFrom.getTime() < currentDate.getTime()).forEach((item) => {
    if (STATISTICS.spentMoney.has(item.type)) {
      STATISTICS.spentMoney.set(item.type, STATISTICS.spentMoney.get(item.type) + item.price);
    }
    if (STATISTICS.wasUsed.has(item.type)) {
      STATISTICS.wasUsed.set(item.type, STATISTICS.wasUsed.get(item.type) + 1);
    }
    if (STATISTICS.spentTime.has(item.type)) {
      const spentTime = moment.duration(moment(item.dateTo).diff(item.dateFrom)).hours();
      STATISTICS.spentTime.set(item.type, STATISTICS.spentTime.get(item.type) + spentTime);
    }
  });

  return STATISTICS;
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
    updateData(getStatistics(filtered));
  }
};

// Хотел изначально добавить это в виде метода для класса ModelEvent
// но появляется ошибка которую я не могу исправить
const toRAW = (data) => {
  const listOfOffers = [];

  data.offers.forEach((item, key) => {
    listOfOffers.push({
      title: key,
      price: item.price,
      accepted: item.isChecked,
    });
  });
  return {
    'id': data.id,
    'type': data.type,
    'date_from': data.dateFrom.getTime(),
    'date_to': data.dateTo.getTime(),
    'base_price': data.price,
    'offers': listOfOffers,
    'destination': {
      'name': data.city,
      'pictures': data.photos || [],
      'description': data.description,
    },
    'is_favorite': !!data.isFavorite,
  };
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

const onSubmit = (newObject, event) => {
  const submitBtn = event.element.querySelector(`.point__button--save`);
  const deleteBtn = event.element.querySelector(`.point__button--delete`);

  lockForm(submitBtn, deleteBtn);
  api.updateEvent({id: event.id, data: toRAW(newObject)}).then((newEvent) => {
    const filtered = filterEvents(state.events, state.filter);
    const sort = sortEvents(filtered, state.sort);

    updateDataEvent(newEvent);
    renderEvents(sort);
    updateData(getStatistics(filtered));
    event.destroy();
  })
    .catch(() => {
      unlockForm(submitBtn, deleteBtn);
      initErrorForm(event.element);
    });
};

const makeImage = (src, alt, className) => {
  const img = new Image();
  img.src = src;
  img.alt = alt;
  img.classList.add(className);
  return img;
};

const onChangeType = (element, evt) => {
  const offfers = element.element.querySelector(`.point__offers-wrap`);
  const selectedWay = element.element.querySelector(`.travel-way__label`);
  const totalPrice = element.element.querySelector(`.point__price input`);
  const destinationLabel = element.element.querySelector(`.point__destination-label`);

  selectedWay.textContent = TYPE_EVENTS[evt.target.value].icon;
  destinationLabel.textContent = `${evt.target.value} ${TYPE_EVENTS[evt.target.value].add}`;
  if (!offers.has(evt.target.value)) {
    offfers.innerHTML = ``;
    element._offers = new Map();
    return;
  }
  const targetType = offers.get(evt.target.value);
  const fragmentForOffers = document.createDocumentFragment();

  totalPrice.value = element._price;
  targetType.forEach((offer) => {
    const offerTemplate = element.offerTemplate(offer.name, offer.price);
    fragmentForOffers.appendChild(createElement(offerTemplate));
  });
  element._offers.clear();
  targetType.forEach((offer) => {
    element._offers.set(offer.name, {price: offer.price, isChecked: false});
  });
  offfers.innerHTML = ``;
  offfers.appendChild(fragmentForOffers);
};

const onSearch = (element) => {
  const datalist = element.element.querySelector(`datalist`);
  const citiesFragment = document.createDocumentFragment();

  for (let [key] of citiesList) {
    citiesFragment.appendChild(createElement(`<option value="${key}">`));
  }
  datalist.appendChild(citiesFragment);
};

const onChangeCity = (element, evt) => {
  const pictures = element.element.querySelector(`.point__destination-images`);
  const description = element.element.querySelector(`.point__destination-text`);

  if (!citiesList.has(evt.target.value)) {
    pictures.innerHTML = ``;
    pictures.textContent = `no photos`;
    description.textContent = `no description`;
    element._description = ``;
    element._photos = [];
    return;
  }
  const targetCity = citiesList.get(evt.target.value);
  const fragmentForPhotos = document.createDocumentFragment();

  description.textContent = targetCity.description;
  element._description = targetCity.description;
  element._photos = targetCity.pictures;
  targetCity.pictures.forEach((picture) => {
    fragmentForPhotos.appendChild(makeImage(picture.src, picture.alt, `point__destination-image`));
  });
  pictures.innerHTML = ``;
  pictures.appendChild(fragmentForPhotos);
};

const onKeyDownEscExit = (element, evt) => {
  if (evt.keyCode === ESC_KEY_CODE) {
    const filtered = filterEvents(state.events, state.filter);
    const sort = sortEvents(filtered, state.sort);

    element.destroy();
    renderEvents(sort);
    newEventBtn.disabled = !newEventBtn.disabled;
  }
};

const onChangeOffers = (element, evt) => {
  const totalPrice = element.element.querySelector(`.point__price input`);
  const isChecked = evt.target.checked;
  let getPriceOfOffer;

  if (isChecked && element._offers.has(evt.target.value)) {
    getPriceOfOffer = element._offers.get(evt.target.value).price;
    totalPrice.value = +totalPrice.value + getPriceOfOffer;
  } else {
    getPriceOfOffer = element._offers.get(evt.target.value).price;
    totalPrice.value = +totalPrice.value - getPriceOfOffer;
  }
};

const onDelete = (element, id) => {
  const submitBtn = element.element.querySelector(`.point__button--save`);
  const deleteBtn = element.element.querySelector(`.point__button--delete`);

  submitBtn.disabled = true;
  deleteBtn.disabled = true;
  deleteBtn.textContent = `Deleting...`;
  api.deleteEvent({id})
    .then(() => api.getOffers())
    .then(() => {
      deleteEvent(id);
      element.destroy();
      if (state.events === null) {
        state.events = [];
      }
      const filtered = filterEvents(state.events, state.filter);
      const sort = sortEvents(filtered, state.sort);
      renderEvents(sort);
      updateData(getStatistics(state.events));
    })
    .catch(() => {
      initErrorForm(element.element);
    });
  newEventBtn.disabled = false;
};

const renderEvents = (events) => {
  if (events.length === 0) {
    points.innerHTML = ``;
    return;
  }
  const getTotalCost = [...events.map((it) => +it.price)].reduce((a, c) => a + c);
  const totalCost = new TotalCost(getTotalCost);
  const days = events.map((it) => moment(it.dateFrom).format(`DD MMM YY`));
  const listOfDays = [...new Set(days)];
  points.innerHTML = ``;
  for (let date of listOfDays) {
    const dayGroup = events.filter((it) => moment(it.dateFrom).format(`DD MMM YY`) === date);
    const day = new Day(date).render();
    const pointsContainer = day.querySelector(`.trip-day__items`);
    dayGroup.forEach((item) => {
      const waypointComponent = new Waypoint(item);
      const openedWaypoint = new EditWaypoint(item);

      waypointComponent.onClick = () => {
        openedWaypoint.render();
        pointsContainer.replaceChild(openedWaypoint.element, waypointComponent.element);
      };
      openedWaypoint.onChangeType = onChangeType;
      openedWaypoint.onSearch = onSearch;
      openedWaypoint.onChangeCity = onChangeCity;
      openedWaypoint.onSubmit = onSubmit;
      openedWaypoint.onKeyDownEscExit = onKeyDownEscExit;
      openedWaypoint.onChangeOffers = onChangeOffers;
      openedWaypoint.onDelete = onDelete;
      waypointComponent.render();
      pointsContainer.appendChild(waypointComponent.element);
    });
    points.appendChild(day);
  }

  eventContaiter.innerHTML = ``;
  header.lastElementChild.remove();
  header.appendChild(totalCost.render());
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

const renderFilters = (filtersData) => {
  const fragment = document.createDocumentFragment();

  for (let item of filtersData) {
    const filter = new Filter(item);
    filter.render();
    filter.onFilter = (evt) => {
      state.filter = evt.target.value;
      const filtered = filterEvents(state.events, state.filter);
      eventContaiter.innerHTML = ``;
      renderEvents(filtered);
    };

    fragment.appendChild(filter.element);
  }

  listOfFilter.innerHTML = ``;
  listOfFilter.appendChild(fragment);
};

const onClickButtonHandle = (evt) => {
  let idEvent;
  if (state.events === null) {
    idEvent = 0;
  } else {
    idEvent = state.events.length;
  }
  const newEvent = new EditWaypoint({id: idEvent});
  newEvent.onChangeType = onChangeType;
  newEvent.onSearch = onSearch;
  newEvent.onChangeCity = onChangeCity;
  evt.target.disabled = true;
  newEvent.onSubmit = (newObject, event) => {
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
      updateData(getStatistics(sort));
      event.destroy();
      evt.target.disabled = false;
    })
      .catch(() => {
        unlockForm(submitBtn, deleteBtn);
        initErrorForm(event.element);
        evt.target.disabled = false;
      });
  };
  newEvent.onKeyDownEscExit = onKeyDownEscExit;
  newEvent.onChangeOffers = onChangeOffers;

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
    const sortItem = new Sort(item);
    sortItem.render();
    sortItem.onChange = (evt) => {
      const filtered = filterEvents(state.events, state.filter);
      state.sort = evt.target.value;
      const sorted = sortEvents(filtered, state.sort);
      eventContaiter.innerHTML = ``;
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

newEventBtn.addEventListener(`click`, onClickButtonHandle);
onClickToggleModeView();
renderFilters(filters);
renderSorts(sorts);
eventContaiter.innerHTML = `Loading route...`;
api.getPoints()
  .then((events) => {
    if (events.length === 0) {
      eventContaiter.innerHTML = ``;
      points.innerHTML = ``;
    } else {
      renderEvents(events);
      updateData(getStatistics(events));
      state.events = events;
    }
  })
  .catch(() => {
    eventContaiter.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });

