const TYPE_EVENTS = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'Transport': `🚊`,
  'Drive': `🚗`,
  'flight': `✈️`,
  'sightseeing': `🏛️`,
  'ship': `🛳️`,
  'check-in': `🏨`,
  'Restaurant': `🍴`,
};

const STATISTICS = {
  spentMoney: new Map([
    [`flight`, 0],
    [`check-in`, 0],
    [`Drive`, 0],
    [`sight-seeing`, 0],
    [`Restaurant`, 0],
    [`taxi`, 0],
    [`train`, 0],
    [`bus`, 0],
  ]),
  wasUsed: new Map([
    [`Drive`, 0],
    [`taxi`, 0],
    [`flight`, 0],
    [`train`, 0],
    [`bus`, 0],
  ]),
};

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

export {TYPE_EVENTS, filters, STATISTICS};
