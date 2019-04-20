const TYPE_EVENTS = {
  'taxi': {icon: `🚕`, add: `to`},
  'bus': {icon: `🚌`, add: `to`},
  'train': {icon: `🚂`, add: `to`},
  'ship': {icon: `🛳️`, add: `to`},
  'transport': {icon: `🚊`, add: `to`},
  'drive': {icon: `🚗`, add: `to`},
  'flight': {icon: `✈️`, add: `to`},
  'check-in': {icon: `🏨`, add: `in`},
  'sightseeing': {icon: `🏛️`, add: `in`},
  'restaurant': {icon: `🍴`, add: `in`},
};

const STATISTICS = {
  spentMoney: new Map([
    [`flight`, 0],
    [`check-in`, 0],
    [`taxi`, 0],
    [`sight-seeing`, 0],
    [`Restaurant`, 0],
    [`Drive`, 0],
    [`ship`, 0],
    [`train`, 0],
    [`bus`, 0],
  ]),
  wasUsed: new Map([
    [`Drive`, 0],
    [`taxi`, 0],
    [`flight`, 0],
    [`ship`, 0],
    [`train`, 0],
    [`bus`, 0],
  ]),
  spentTime: new Map([
    [`flight`, 0],
    [`check-in`, 0],
    [`taxi`, 0],
    [`sight-seeing`, 0],
    [`Restaurant`, 0],
    [`Drive`, 0],
    [`ship`, 0],
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

const sorts = [
  {
    id: `sorting-event`,
    value: `event`,
    isChecked: true,
  },
  {
    id: `sorting-time`,
    value: `time`,
    isChecked: false,
  },
  {
    id: `sorting-price`,
    value: `price`,
    isChecked: false,
  },
];

export {TYPE_EVENTS, filters, STATISTICS, sorts};
