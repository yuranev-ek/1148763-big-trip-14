import Observer from '../utils/observer.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Cannot update unexisting point');
    }

    this._points = [...this._points.slice(0, index), update, ...this._points.slice(index + 1)];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [update, ...this._points];

    this._notify(updateType, update);
  }

  deletePoint(updateType, pointId) {
    const index = this._points.findIndex((point) => point.id === pointId);

    if (index === -1) {
      throw new Error('Cannot delete unexisting point');
    }

    this._points = [...this._points.slice(0, index), ...this._points.slice(index + 1)];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign({}, point, {
      id: point.id,
      basePrice: point.base_price,
      dateStart: point.date_from,
      dateEnd: point.date_to,
      isFavorite: point.is_favorite,
      destination: point.destination,
      offers: {
        list: point.offers,
        type: point.type,
      },
    });

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.type;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const offers =
      point.offers !== null
        ? point.offers.list.map((offer) => ({ price: Number(offer.price), title: offer.title }))
        : [];

    const adaptedPoint = Object.assign({}, point, {
      id: point.id,
      base_price: Number(point.basePrice),
      date_from: point.dateStart,
      date_to: point.dateEnd,
      is_favorite: point.isFavorite,
      destination: point.destination,
      offers,
      type: point.offers !== null && point.offers.type,
    });

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateEnd;
    delete adaptedPoint.dateStart;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
