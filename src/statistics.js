import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {STATISTIC} from "./constants";
import moment from 'moment';
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`);
// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
const BAR_HEIGHT = 55;
moneyCtx.height = BAR_HEIGHT * 9;
transportCtx.height = BAR_HEIGHT * 6;
timeSpendCtx.height = BAR_HEIGHT * 9;

const updateData = (data) => {
  moneyChart.data.datasets.forEach((it) => {
    it.data = [...data.spentMoneyTypes.values()];
  });
  transportChart.data.datasets.forEach((it) => {
    it.data = [...data.wasUsedTypes.values()];
  });
  timeSpendChart.data.datasets.forEach((it) => {
    it.data = [...data.spentTimeTypes.values()];
  });
  moneyChart.update();
  transportChart.update();
  timeSpendChart.update();
};

const getStatistics = (events, cb) => {
  const currentDate = new Date();
  STATISTIC.spentMoneyTypes.forEach((item, key) => STATISTIC.spentMoneyTypes.set(key, 0));
  STATISTIC.wasUsedTypes.forEach((item, key) => STATISTIC.wasUsedTypes.set(key, 0));
  STATISTIC.spentTimeTypes.forEach((item, key) => STATISTIC.spentTimeTypes.set(key, 0));

  events.filter((it) => {
    return it.dateFrom < currentDate;
  }).forEach((item) => {
    if (STATISTIC.spentMoneyTypes.has(item.type)) {
      STATISTIC.spentMoneyTypes.set(item.type, STATISTIC.spentMoneyTypes.get(item.type) + item.price);
    }
    if (STATISTIC.wasUsedTypes.has(item.type)) {
      STATISTIC.wasUsedTypes.set(item.type, STATISTIC.wasUsedTypes.get(item.type) + 1);
    }
    if (STATISTIC.spentTimeTypes.has(item.type)) {
      const spentTime = Math.floor(moment.duration(moment(item.dateTo).diff(item.dateFrom)) / 1000 / 60 / 60);
      STATISTIC.spentTimeTypes.set(item.type, STATISTIC.spentTimeTypes.get(item.type) + spentTime);
    }
  });
  cb(STATISTIC);
};

const moneyChart = new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`✈️FLY`, `🏨 STAY`, `🚕 TAXI`, `🏛️ LOOK`, `🍴 EAT`, `🚗 DRIVE`, `🛳️ SAIL`, `🚂 TRAIN`, `🚌 BUS`],
    datasets: [{
      data: [],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `€ ${val}`,
      },
    },
    title: {
      display: true,
      text: `MONEY`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`,
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        minBarLength: 50,
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const transportChart = new Chart(transportCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`, `🚂 TRAIN`, `🚌 BUS`],
    datasets: [{
      data: [],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `${val}x`,
      },
    },
    title: {
      display: true,
      text: `TRANSPORT`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`,
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        minBarLength: 50,
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const timeSpendChart = new Chart(timeSpendCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`✈️AIRCRAFT`, `🏨 HOTEL`, `🚕 TAXI`, `🏛️ LOOK`, `🍴 RESTAURANTS`, `🚗 DRIVE`, `🛳️ SHIP`, `🚂 TRAIN`, `🚌 BUS`],
    datasets: [{
      data: [],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `${val}H`
      }
    },
    title: {
      display: true,
      text: `TIME SPENT`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});

export {updateData, getStatistics};
