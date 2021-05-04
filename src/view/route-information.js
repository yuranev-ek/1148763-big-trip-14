import AbstractView from './abstract-view.js';
import { DATE_FORMAT } from '../const.js';
import { formatDate } from '../utils/date.js';

const createTripTitleTemplate = (points) => {
  let prevDestinationName = null;
  return points
    .reduce((acc, cur, index) => {
      const curDestinationName = cur.destination.name;
      const dash = index !== points.length - 1 ? '&mdash;' : '';
      const isSame = curDestinationName === prevDestinationName;
      prevDestinationName = curDestinationName;
      return isSame ? acc : `${acc}${curDestinationName} ${dash} `;
    }, '')
    .trim();
};

const createRouteInformationTemplate = (points = []) => {
  if (points.length) {
    const tripTitleTemplate = createTripTitleTemplate(points);
    const startTripDay = formatDate(points[0].dateStart, DATE_FORMAT.DAY);
    const endTripDay = formatDate(points[points.length - 1].dateEnd, DATE_FORMAT.DAY);

    return `
    <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${tripTitleTemplate}</h1>
            <p class="trip-info__dates">${startTripDay}&nbsp;&mdash;&nbsp;${endTripDay}</p>
        </div>
    </section>
    `;
  } else {
    return `
    <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main"></div>
    </section>
    `;
  }
};

export default class RouteInformation extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }
  getTemplate() {
    return createRouteInformationTemplate(this._points);
  }
}
