const typeEvents = {
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

const getRandomDate = (start, end) => {
  start = new Date(...start);
  end = new Date(...end);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomInt = (max = 1, min = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (max < min || max < 0 || min < 0) {
    return 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomPhotos = (amount)=> {
  const emptyList = [];
  for (let i = 0; i < amount; i++) {
    emptyList.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return emptyList;
};

const generateEvent = () => {
  const START_DATE = [2019, 1, 1];
  const END_DATE = [2020, 1, 1];
  const MAX_COST = 300;
  const MIN_COST = 10;
  const MAX_PHOTOS = 10;
  const keysOfEvent = Object.keys(typeEvents);
  const randomDate = getRandomDate(START_DATE, END_DATE);
  const hour = randomDate.getHours();
  const minutes = randomDate.getMinutes();
  return {
    date: {
      month: randomDate.getMonth() + 1,
      monthString: new Intl.DateTimeFormat(`en-US`, {month: `short`}).format(randomDate),
      day: randomDate.getDay() + 1,
    },
    type: keysOfEvent[Math.floor(Math.random() * keysOfEvent.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    name: `${NAMES[getRandomInt(NAMES.length - 1)]}`,
    time: {
      from: `${hour}:${minutes}`,
      to: `${randomDate.getHours() + 1}:${randomDate.getMinutes()}`,
      duration: (randomDate.getTime() + (1000 * 60 * 60 * 24) - randomDate.getTime()) / 1000 / 60 / 60 / 24
    },
    price: getRandomInt(MAX_COST, MIN_COST),
    offers: [...OFFERS.slice(getRandomInt(OFFERS.length))],
    photos: getRandomPhotos(getRandomInt(MAX_PHOTOS, 1)),
    description: [...DESC.slice(getRandomInt(DESC.length))].join()
  };
};

export {typeEvents, generateEvent};
