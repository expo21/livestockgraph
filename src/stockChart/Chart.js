import React, { Component } from "react";
import StocksGraph from "./StockGraph";

class LiveChart extends Component {
  state = {
    // stocks = {name: {current_value: 12, history: [{time: '2131', value: 45}, ...], is_selected: false}, ...}
    stocks: {},
    // market_trend: undefined, // 'up' or 'down'
    connectionError: false,
  };

  componentDidMount() {
    this.connection = new WebSocket("ws://stocks.mnet.website/");
    this.connection.onmessage = this.saveNewStockValues;
    this.connection.onclose = () => {
      this.setState({ connectionError: true });
    };
  }
  saveNewStockValues = (e) => {
    let result = JSON.parse(e.data);

    let [up_values_count, down_values_count] = [0, 0];
    let current_time = Date.now();
    let new_stocks = this.state.stocks;
    result.map((stock) => {
      // stock = ['name', 'value']
      if (this.state.stocks[stock[0]]) {
        new_stocks[stock[0]].current_value > Number(stock[1])
          ? up_values_count++
          : down_values_count++;
        new_stocks[stock[0]].current_value = Number(stock[1]);
        return new_stocks[stock[0]].history.push({
          time: current_time,
          value: Number(stock[1]),
        });
      } else {
        return (new_stocks[stock[0]] = {
          current_value: stock[1],
          history: [{ time: Date.now(), value: Number(stock[1]) }],
          is_selected: true,
        });
      }
    });

    this.setState({
      stocks: new_stocks,
    });
  };

  render() {
    return (
      <div className="container graph-container">
        <div className="columns">
          <h3>hello</h3>
          <StocksGraph stocks={this.state.stocks} />
        </div>
      </div>
    );
  }
}
export default LiveChart;
