class ModelEvent {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.dateFrom = new Date(data[`date_from`]);
    this.dateTo = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.offers = new Map();
    this.city = data.destination.name;
    this.photos = data.destination.pictures;
    this.description = data.destination.description;
    this.isFavorite = !!data[`is_favorite`];

    data[`offers`].forEach((item) => {
      this.offers.set(item[`title`], {
        price: item[`price`],
        isChecked: item[`accepted`],
      });
    });
  }
  static parseEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }
}

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
    'is_favorite': data.isFavorite,
  };
};

export {ModelEvent, toRAW};
