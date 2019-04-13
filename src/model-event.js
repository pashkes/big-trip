class ModelEvent {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.dateFrom = new Date(data[`date_from`]);
    this.dateTo = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.offers = new Map();
    this.city = data[`destination`][`name`];
    this.photos = data[`destination`].pictures || [];
    this.description = data.destination.description;
    this.isFavorite = Boolean(data[`is_favorite`]);

    data[`offers`].forEach((item) => {
      this.offers.set(item[`title`], {
        price: item[`price`],
        isChecked: item[`accepted`],
      });
    });
  }

  toRAW() {
    const offers = {};
    this.offers.forEach((item, key) => {
      offers.title = key;
      offers.price = item.price;
      offers.accepted = item.isChecked;
    });
    return {
      'id': this.id,
      'type': this.type,
      'date_from': this.dateFrom.getTime(),
      'date_to': this.dateTo.getTime(),
      'base_price': this.price,
      'offers': offers,
      'destination': {
        'name': this.city,
        'pictures': this.photos,
        'description': this.description
      },
      'is_favorite': this.isFavorite ? `true` : `false`
    };
  }

  static parseEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }
}

export default ModelEvent;
