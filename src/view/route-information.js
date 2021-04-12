const createTripTitleTemplate = (events) => {
  let prevDestinationName = null;
  return events
    .reduce((acc, cur, index) => {
      const curDestinationName = cur.destination.name;
      const dash = index !== events.length - 1 ? '&mdash;' : '';
      const isSame = curDestinationName === prevDestinationName;
      prevDestinationName = curDestinationName;
      return isSame ? acc : (acc += `${curDestinationName} ${dash} `);
    }, '')
    .trim();
};

export const createRouteInformationTemplate = (events) => {
  const tripTitleTemplate = createTripTitleTemplate(events);
  return `
    <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${tripTitleTemplate}</h1>
            <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
        </div>
    </section>
    `;
};
