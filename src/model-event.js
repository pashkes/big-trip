class ModelEvent {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.dateFrom = new Date(data[`date_from`]);
    this.dateTo = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.offers = data[`offers`].map((item) => {
      return {
        name: item[`title`],
        price: item[`price`],
        isChecked: item[`accepted`],
      };
    }) || [];
    this.city = data[`destination`].name;
    this.photos = data[`destination`].pictures || [];
    this.description = data.destination.description;
    this.isFavorite = Boolean(data[`is_favorite`]);
  }
  static parseEvent(data) {
    return new ModelEvent(data);
  }
  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }
}

export default ModelEvent;
