import React, { Component } from "react";
import { Line } from "react-chartjs-2";

const chartColors = [
  "rgb(244, 67, 54)",
  "rgb(76, 175, 80)",
  "rgb(63, 81, 181)",
  "rgb(255, 152, 0)",
  "rgb(33, 150, 243)",
  "rgb(139, 195, 74)",
  "rgb(255, 87, 34)",
  "rgb(121, 85, 72)",
  "rgb(233, 30, 99)",
  "rgb(205, 220, 57)",
  "rgb(156, 39, 176)",
  "rgb(255, 235, 59)",
  "rgb(158, 158, 158)",
  "rgb(103, 58, 183)",
  "rgb(0, 150, 136)",
  "rgb(255, 193, 7)",
  "rgb(96, 125, 139)",
  "rgb(33, 33, 33)",
  "rgb(169, 4, 4)",
  "rgb(1, 74, 64)",
  "rgb(179, 3, 72)",
  "rgb(84, 58, 68)",
];

let chartJsConfig = {
  responsive: true,
  scales: {
    xAxes: [
      {
        type: "time",
        distribution: "linear",
        ticks: {
          source: "auto",
        },
        time: {
          displayFormats: { second: "h:mm:ss a" },
          unit: "second",
        },
        scaleLabel: {
          display: true,
          labelString: "Time",
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          stepValue: 10,
          steps: 10,
        },
        scaleLabel: {
          display: true,
          labelString: "Price ($)",
        },
      },
    ],
  },
  pan: {
    enabled: true,
    mode: "x",
  },
  zoom: {
    enabled: true,
    drag: false,
    mode: "x",
  },
};

export default class StockGraph extends Component {
  // this.chart = React.createRef();

  updateChart = () => {
    let chart = this.refs.chart.chartInstance;
    if (Object.keys(this.props.stocks).length === 0) {
      chart.data.datasets = [];
      return chart.update();
    }
    Object.keys(this.props.stocks).map((stock_name, index) => {
      let chart_dataset = chart.data.datasets.find((dataset) => {
        return dataset.label === stock_name.toUpperCase();
      });

      if (this.props.stocks[stock_name].is_selected) {
        let current_stock = this.props.stocks[stock_name];
        if (chart_dataset) {
          chart_dataset.data = this.getStockValues(
            this.props.stocks[stock_name]
          );
        } else {
          if (current_stock) {
            console.log(this.getStockValues(current_stock));
            chart.data.datasets = chart.data.datasets.concat([
              this.chartDataset(
                stock_name,
                chartColors[index],
                this.getStockValues(current_stock)
              ),
            ]);
          }
        }
      }
    });

    chart.update();
  };

  componentDidUpdate = () => {
    this.updateChart();
  };

  chartDataset = (stock_name, color, stock_values) => {
    return {
      label: stock_name.toUpperCase(),
      fill: false,
      lineTension: 0,
      backgroundColor: "rgb(84, 58, 68)",
      borderColor: color,
      borderCapStyle: "butt",
      borderJoinStyle: "miter",
      pointBorderColor: color,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: color,
      pointHoverBorderWidth: 2,
      pointRadius: 3,
      pointHitRadius: 10,
      data: stock_values,
    };
  };

  // returns an array of objects, {t: timestamp, y: value}
  getStockValues = (stock) => {
    return stock.history.map((history) => {
      //   return { t: new Date(history.time), y: history.value };
      return {
        t: new Date(history.time),
        y: [
          Number(history.value),
          //   Number(history.value),
          //   Number(history.value),
          //   Number(history.value),
        ],
      };
    });
  };

  render() {
    return (
      <div className="card column">
        <div className="card-header">
          <div className="card-header-title">Live stock graph</div>
        </div>
        <div className="card-content">
          <Line data={{ datasets: [] }} options={chartJsConfig} ref="chart" />
        </div>
      </div>
    );
  }
}
