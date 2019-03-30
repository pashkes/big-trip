const COUNT_EVENTS = 16;
const START_DATE = new Date(2018, 1, 1);
const END_DATE = new Date(2020, 1, 1);
const MAX_COST = 300;
const MIN_COST = 10;
const MAX_OFFERS = 2;
const MAX_PHOTOS = 10;
const MAX_SENTENCES = 3;
const TYPE_EVENTS = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'Ship': `🛳️`,
  'Transport': `🚊`,
  'Drive': `🚗`,
  'flight': `✈️`,
  'sight-seeing': `🏛️`,
  'check-in': `🏨`,
  'Restaurant': `🍴`,
};
const OFFERS = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];
const DESC = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
];
const CITIES = [`Amsterdam`, `Geneva`, `Chamonix`, `London`, `Berlin`, `Vienna`, `Paris`, `Manchester`];
const moneyCategories = new Map([
  [`flight`, 0],
  [`check-in`, 0],
  [`Drive`, 0],
  [`sight-seeing`, 0],
  [`Restaurant`, 0],
  [`taxi`, 0],
  [`Ship`, 0],
  [`train`, 0],
  [`bus`, 0]
]);
const typesOfTransport = new Map([
  [`Drive`, 0],
  [`taxi`, 0],
  [`flight`, 0],
  [`Ship`, 0],
  [`train`, 0],
  [`bus`, 0],
]);
const filters = [
  {
    id: `filter-everything`,
    name: `Everything`,
    isChecked: true,
    value: `everything`,
  },
  {
    id: `filter-future`,
    name: `Future`,
    isChecked: false,
    value: `future`,
  },
  {
    id: `filter-past`,
    name: `Past`,
    isChecked: false,
    value: `past`,
  },
];

const getRandomInt = (max = 1, min = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (max < min || max < 0 || min < 0) {
    return 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (start, end) => {
  return new Date(getRandomInt(end, start));
};

const doMixOfArray = (array, count) => {
  const cloneItems = [...array];
  const mixedItems = [];
  for (let i = 0; i < count; i++) {
    let indexRandomOfElement = getRandomInt(cloneItems.length - 1, 0);
    mixedItems.push(cloneItems[indexRandomOfElement]);
    cloneItems.splice(indexRandomOfElement, 1);
  }
  return mixedItems;
};

const getRandomPhotos = (count) => {
  const photos = [];
  for (let i = 0; i < count; i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return photos;
};

const generateEvent = () => {
  const keysOfEvent = Object.keys(TYPE_EVENTS);
  const startDate = getRandomDate(START_DATE, END_DATE);
  const endDate = getRandomDate(startDate, END_DATE);
  return {
    type: keysOfEvent[Math.floor(Math.random() * keysOfEvent.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    date: {
      from: startDate,
      to: endDate,
      duration: 1,
    },
    price: getRandomInt(MAX_COST, MIN_COST),
    offers: new Set(doMixOfArray(OFFERS, getRandomInt(MAX_OFFERS, 0))),
    photos: getRandomPhotos(getRandomInt(MAX_PHOTOS, 1)),
    description: doMixOfArray(DESC, getRandomInt(MAX_SENTENCES, 1)),
  };
};

const getMockData = () => {
  const events = [];
  for (let i = 0; i < COUNT_EVENTS; i++) {
    events.push(generateEvent());
  }
  return events;
};

export {getMockData, TYPE_EVENTS, filters, moneyCategories, typesOfTransport};
