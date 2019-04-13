import Filter from "./filter";
import Waypoint from "./waypoint";
import EditWaypoint from "./edit-waypoint";
import updateData from "./statistics";
import {filters, STATISTICS, TYPE_EVENTS} from "./data";
import onClickToggleModeView from "./view-mode";
import API from "./api";
import {createElement} from "./util";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=14`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const destinations = api.getDestination();
const getOffers = api.getOffers();
const offers = new Map();
const citiesList = new Map();
const eventContaiter = document.querySelector(`.trip-day__items`);
const listOfFilter = document.querySelector(`.trip-filter`);
const animationDurationMC = 800;
const state = {
  events: null,
  filter: `everything`,
};
destinations.then((cities) => {
  cities.forEach((city) => {
    citiesList.set(city.name, {description: city.description, pictures: [...city.pictures]});
  });
});

getOffers.then((list) => list.forEach((item) => {
  offers.set(item.type, item.offers);
}));
const getStatistics = (events) => {
  STATISTICS.spentMoney.forEach((item, key) => STATISTICS.spentMoney.set(key, 0));
  STATISTICS.wasUsed.forEach((item, key) => STATISTICS.wasUsed.set(key, 0));
  events.forEach((item) => {
    if (STATISTICS.spentMoney.has(item.type)) {
      STATISTICS.spentMoney.set(item.type, STATISTICS.spentMoney.get(item.type) + item.price);
    }
    if (STATISTICS.wasUsed.has(item.type)) {
      STATISTICS.wasUsed.set(item.type, STATISTICS.wasUsed.get(item.type) + 1);
    }
  });
  return STATISTICS;
};

const updateEvent = (newEvent) => {
  const updatedItemIndex = state.events.findIndex((item) => item.id === newEvent.id);
  return Object.assign(state.events[updatedItemIndex], newEvent);
};

const deleteEvent = (id) => {
  const removedItemIndex = state.events.findIndex((item) => item.id === id);
  const filtered = filterEvents(state.events, state.filter);
  state.events.splice(removedItemIndex, 1);
  renderEvents(filtered);
  updateData(getStatistics(filtered));
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
      'pictures': data.photos,
      'description': data.description,
    },
    'is_favorite': data.isFavorite ? `true` : `false`,
  };
};

const onSubmit = (newObject, event) => {
  // Тут и в сеттере onDelete есть одинаковый код который нужно было бы куда-то
  // отдельно вынести поидее
  const submitBtn = event.element.querySelector(`.point__button--save`);
  const deleteBtn = event.element.querySelector(`.point__button--delete`);
  submitBtn.disabled = true;
  deleteBtn.disabled = true;
  submitBtn.textContent = `Saving...`;
  api.updateEvent({id: event.id, data: toRAW(newObject)}).then((newEvent) => {
    const filtered = filterEvents(state.events, state.filter);
    updateEvent(newEvent);
    renderEvents(filtered);
    updateData(getStatistics(filtered));
    event.destroy();
  })
    .catch(() => {
      event.element.classList.add(`jello`);
      event.element.classList.add(`error`);
      submitBtn.textContent = `Save`;
      submitBtn.disabled = false;
      deleteBtn.disabled = false;
      setTimeout(() => {
        event.element.classList.remove(`jello`);
        event.element.classList.remove(`error`);
      }, animationDurationMC);
    });
};

const createImage = (src, alt, className) => {
  const img = new Image();
  img.src = src;
  img.alt = alt;
  img.classList.add(className);
  return img;
};

const renderEvents = (events) => {
  const fragment = document.createDocumentFragment();

  events.forEach((item) => {
    const waypointComponent = new Waypoint(item);
    const openedWaypoint = new EditWaypoint(item);

    waypointComponent.onClick = () => {
      openedWaypoint.render();
      eventContaiter.replaceChild(openedWaypoint.element, waypointComponent._element);
    };

    openedWaypoint.onChangeType = (evt) => {
      const offfers = openedWaypoint.element.querySelector(`.point__offers-wrap`);
      if (!offers.has(evt.target.value)) {
        offfers.innerHTML = ``;
        openedWaypoint._offers = new Map();
        return;
      }
      const selectedWay = openedWaypoint.element.querySelector(`.travel-way__label`);
      const targetType = offers.get(evt.target.value);
      const fragmentForOffers = document.createDocumentFragment();
      selectedWay.textContent = TYPE_EVENTS[evt.target.value];
      targetType.forEach((offer) => {
        const offerTemplate = openedWaypoint.offerTemplate(offer.name, offer.price);
        fragmentForOffers.appendChild(createElement(offerTemplate));
      });
      openedWaypoint._offers.clear();
      targetType.forEach((offer) => {
        openedWaypoint._offers.set(offer.name, {price: offer.price, isChecked: false});
      });
      offfers.innerHTML = ``;
      offfers.appendChild(fragmentForOffers);
    };

    openedWaypoint.onSearch = () => {
      const datalist = openedWaypoint.element.querySelector(`datalist`);
      const citiesFragment = document.createDocumentFragment();
      for (let [key] of citiesList) {
        citiesFragment.appendChild(createElement(`<option value="${key}">`));
      }
      datalist.appendChild(citiesFragment);
    };

    openedWaypoint.onChangeCity = (evt) => {
      const pictures = openedWaypoint.element.querySelector(`.point__destination-images`);
      const description = openedWaypoint.element.querySelector(`.point__destination-text`);
      if (!citiesList.has(evt.target.value)) {
        pictures.innerHTML = ``;
        pictures.textContent = `no photos`;
        description.textContent = `no description`;
        openedWaypoint._description = ``;
        openedWaypoint._photos = [];
        return;
      }
      const targetCity = citiesList.get(evt.target.value);
      const fragmentForPhotos = document.createDocumentFragment();
      description.textContent = targetCity.description;
      openedWaypoint._description = targetCity.description;
      openedWaypoint._photos = targetCity.pictures;
      targetCity.pictures.forEach((picture) => {
        fragmentForPhotos.appendChild(createImage(picture.src, picture.alt, `point__destination-image`));
      });
      pictures.innerHTML = ``;
      pictures.appendChild(fragmentForPhotos);
    };

    openedWaypoint.onSubmit = onSubmit;

    openedWaypoint.onDelete = () => {
      const submitBtn = openedWaypoint.element.querySelector(`.point__button--save`);
      const deleteBtn = openedWaypoint.element.querySelector(`.point__button--delete`);
      submitBtn.disabled = true;
      deleteBtn.disabled = true;
      deleteBtn.textContent = `Deleting...`;
      api.deleteEvent({id: item.id})
        .then(() => api.getOffers())
        .then(() => {
          deleteEvent(item.id);
          openedWaypoint.destroy();
          updateData(getStatistics(state.events));
        })
        .catch(() => {
          openedWaypoint.element.classList.add(`jello`);
          openedWaypoint.element.classList.add(`error`);
          deleteBtn.textContent = `Delete`;
          submitBtn.disabled = false;
          deleteBtn.disabled = false;
          setTimeout(() => {
            openedWaypoint.element.classList.remove(`jello`);
            openedWaypoint.element.classList.remove(`error`);
          }, animationDurationMC);
        });
    };

    waypointComponent.render();
    fragment.appendChild(waypointComponent.element);
  });

  eventContaiter.innerHTML = ``;
  eventContaiter.appendChild(fragment);
};

const filterEvents = (events, filterType) => {
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
      eventContaiter.innerHTML = ``;
      state.filter = evt.target.value;
      const filtered = filterEvents(state.events, state.filter);
      renderEvents(filtered);
      updateData(getStatistics(filtered));
    };

    fragment.appendChild(filter.element);
  }

  listOfFilter.innerHTML = ``;
  listOfFilter.appendChild(fragment);
};

renderFilters(filters);
eventContaiter.innerHTML = `Loading route...`;
api.getPoints()
  .then((events) => {
    renderEvents(events);
    state.events = events;
  })
  .catch(() => {
    eventContaiter.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
onClickToggleModeView();
