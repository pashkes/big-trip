import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {STATISTICS} from "./constants";
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
    it.data = [...data.spentMoney.values()];
  });
  transportChart.data.datasets.forEach((it) => {
    it.data = [...data.wasUsed.values()];
  });
  timeSpendChart.data.datasets.forEach((it) => {
    it.data = [...data.spentTime.values()];
  });
  moneyChart.update();
  transportChart.update();
  timeSpendChart.update();
};

const getStatistics = (events, cb) => {
  const currentDate = new Date();
  STATISTICS.spentMoney.forEach((item, key) => STATISTICS.spentMoney.set(key, 0));
  STATISTICS.wasUsed.forEach((item, key) => STATISTICS.wasUsed.set(key, 0));
  STATISTICS.spentTime.forEach((item, key) => STATISTICS.spentTime.set(key, 0));

  events.filter((it) => {
    return it.dateFrom < currentDate;
  }).forEach((item) => {
    if (STATISTICS.spentMoney.has(item.type)) {
      STATISTICS.spentMoney.set(item.type, STATISTICS.spentMoney.get(item.type) + item.price);
    }
    if (STATISTICS.wasUsed.has(item.type)) {
      STATISTICS.wasUsed.set(item.type, STATISTICS.wasUsed.get(item.type) + 1);
    }
    if (STATISTICS.spentTime.has(item.type)) {
      const spentTime = Math.floor(moment.duration(moment(item.dateTo).diff(item.dateFrom)) / 1000 / 60 / 60);
      STATISTICS.spentTime.set(item.type, STATISTICS.spentTime.get(item.type) + spentTime);
    }
  });
  cb(STATISTICS);
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
