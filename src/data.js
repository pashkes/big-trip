import API from "./api";
import {AUTHORIZATION, END_POINT} from "./constants";
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const offers = new Map();
const citiesList = new Map();
const destinations = api.getDestination();
const getOffers = api.getOffers();

const getCitiesOfList = () => {
  destinations.then((cities) => {
    cities.forEach((city) => {
      citiesList.set(city.name, {description: city.description, pictures: [...city.pictures]});
    });
  });
  return citiesList;
};

const getOffersOfList = () => {
  getOffers.then((list) => list.forEach((item) => {
    offers.set(item.type, item.offers);
  }));
  return offers;
};

export {getCitiesOfList, getOffersOfList};

