const START_DATE = new Date(2019, 1, 1);
const END_DATE = new Date(2020, 1, 1);
const MAX_COST = 300;
const MIN_COST = 10;
const MAX_OFFERS = 2;
const MAX_PHOTOS = 10;
const MAX_SENTENCES = 3;
const TYPE_EVENTS = {
  'Taxi': `🚕`,
  'Bus': `🚌`,
  'Train': `🚂`,
  'Ship': `🛳️`,
  'Transport': `🚊`,
  'Drive': `🚗`,
  'Flight': `✈️`,
  'Sightseeing': `🏛️`,
  'Check-in': `🏨`,
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
const NAMES = [`Taxi to Airport`, `Flight to Geneva`, `Drive to Chamonix`, `Check into a hotel`];

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
  const randomDate = getRandomDate(START_DATE, END_DATE);
  const hour = randomDate.getHours();
  const minutes = randomDate.getMinutes();
  return {
    date: {
      month: randomDate.getMonth() + 1,
      monthShortName: new Intl.DateTimeFormat(`en-US`, {month: `short`}).format(randomDate),
      day: randomDate.getDay() + 1,
    },
    type: keysOfEvent[Math.floor(Math.random() * keysOfEvent.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    name: `${NAMES[getRandomInt(NAMES.length - 1)]}`,
    time: {
      from: `${hour}:${minutes}`,
      to: `${randomDate.getHours() + 1}:${randomDate.getMinutes()}`,
      duration: (randomDate.getTime() + (1000 * 60 * 60 * 24) - randomDate.getTime()) / 1000 / 60 / 60 / 24,
    },
    price: getRandomInt(MAX_COST, MIN_COST),
    offers: doMixOfArray(OFFERS, getRandomInt(MAX_OFFERS, 0)),
    photos: getRandomPhotos(getRandomInt(MAX_PHOTOS, 1)),
    description: doMixOfArray(DESC, getRandomInt(MAX_SENTENCES, 1)),
  };
};

export {generateEvent, TYPE_EVENTS};
