import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { diffConvertedTimeOfPoint, diffOfConvertedTimeOfPoint } from './point.js';

const CHART_NAMES = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME_SPEND: 'TIME-SPEND',
};

const returnUniqueRouteTypes = (points) => {
  const onlyRouteTypes = points.slice().map((point) => point.route);
  const mapRouteTypes = new Map();
  onlyRouteTypes.forEach((route) => mapRouteTypes.set(route, null));
  return mapRouteTypes;
};

const sortRoutesByMostValue = (a, b) => {
  const value1 = a[1];
  const value2 = b[1];

  if (value1 > value2) {
    return -1;
  }

  if (value1 < value2) {
    return 1;
  }

  if (value1 === value2) {
    return 0;
  }

  return null;
};

const renderChart = ({ title, ctx, labels, data, formatter }) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        text: title,
        display: true,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderMoneyChart = (ctx, points) => {
  const uniqueRouteTypesMap = returnUniqueRouteTypes(points);

  points.forEach((point) => {
    let currentPrice = uniqueRouteTypesMap.get(point.route);
    const accPrice = currentPrice !== null ? (currentPrice += point.basePrice) : point.basePrice;
    uniqueRouteTypesMap.set(point.route, accPrice);
  });

  const sortedRouteTypesByQuantity = [...uniqueRouteTypesMap].sort(sortRoutesByMostValue);

  const chartLabels = sortedRouteTypesByQuantity.map((route) => route[0].toUpperCase());
  const chartData = sortedRouteTypesByQuantity.map((route) => route[1]);

  return renderChart({
    ctx,
    title: CHART_NAMES.MONEY,
    labels: chartLabels,
    data: chartData,
    formatter: (val) => `€ ${val}`,
  });
};

const renderTypeChart = (ctx, points) => {
  const uniqueRouteTypesMap = returnUniqueRouteTypes(points);

  points.forEach((point) => {
    let currentQuantity = uniqueRouteTypesMap.get(point.route);
    const accQuantity = currentQuantity !== null ? (currentQuantity += 1) : 1;
    uniqueRouteTypesMap.set(point.route, accQuantity);
  });

  const sortedRouteTypesByQuantity = [...uniqueRouteTypesMap].sort(sortRoutesByMostValue);

  const chartLabels = sortedRouteTypesByQuantity.map((route) => route[0].toUpperCase());
  const chartData = sortedRouteTypesByQuantity.map((route) => route[1]);

  return renderChart({
    ctx,
    title: CHART_NAMES.TYPE,
    labels: chartLabels,
    data: chartData,
    formatter: (val) => val,
  });
};

const renderTimeSpendChart = (ctx, points) => {
  const uniqueRouteTypesMap = returnUniqueRouteTypes(points);

  points.forEach((point) => {
    let currentTimeSpend = uniqueRouteTypesMap.get(point.route);
    const diffTimeSpend = new Date(point.dateEnd) - new Date(point.dateStart);
    const accTimeSpend = currentTimeSpend !== null ? (currentTimeSpend += diffTimeSpend) : diffTimeSpend;
    uniqueRouteTypesMap.set(point.route, accTimeSpend);
  });

  const sortedRouteTypesByQuantity = [...uniqueRouteTypesMap].sort(sortRoutesByMostValue);

  const chartLabels = sortedRouteTypesByQuantity.map((route) => route[0].toUpperCase());
  const chartData = sortedRouteTypesByQuantity.map((route) => route[1]);

  const defaultTime = new Date(1970, 0, 1);

  return renderChart({
    ctx,
    title: CHART_NAMES.TIME_SPEND,
    labels: chartLabels,
    data: chartData,
    formatter: (val) => diffConvertedTimeOfPoint(val, defaultTime),
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._points = points;

    this._moneyCart = null;
    this._typeChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart) {
      this._moneyChart = null;
      this._timeSpendChart = null;
      this._typeChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._points);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyCart !== null || (this._typeChart !== null && this._timeSpendChart !== null)) {
      this._moneyCart = null;
      this._typeChart = null;
      this._timeSpendChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeSpendCtx = this.getElement().querySelector('.statistics__chart--time');

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeSpendCtx.height = BAR_HEIGHT * 5;

    this._moneyCart = renderMoneyChart(moneyCtx, this._points);
    this._typeChart = renderTypeChart(typeCtx, this._points);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._points);
  }
}
