import AbstractView from './abstract-view.js';
import { DATE_FORMAT } from '../const.js';
import { formatDate } from '../utils/date.js';

const createTripTitleTemplate = (events) => {
  let prevDestinationName = null;
  return events
    .reduce((acc, cur, index) => {
      const curDestinationName = cur.destination.name;
      const dash = index !== events.length - 1 ? '&mdash;' : '';
      const isSame = curDestinationName === prevDestinationName;
      prevDestinationName = curDestinationName;
      return isSame ? acc : `${acc}${curDestinationName} ${dash} `;
    }, '')
    .trim();
};

const createRouteInformationTemplate = (events = []) => {
  const tripTitleTemplate = createTripTitleTemplate(events);
  const startTripDay = formatDate(events[0].dateStart, DATE_FORMAT.DAY);
  const endTripDay = formatDate(events[events.length - 1].dateEnd, DATE_FORMAT.DAY);
  return `
    <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${tripTitleTemplate}</h1>
            <p class="trip-info__dates">${startTripDay}&nbsp;&mdash;&nbsp;${endTripDay}</p>
        </div>
    </section>
    `;
};

export default class RouteInformation extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }
  getTemplate() {
    return createRouteInformationTemplate(this._events);
  }
}
