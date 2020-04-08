import React, { useState } from "react";
import "./App.css";
import Ticker from "./components/ticker";
import ServiceLocatorContext from './services/service-locator-context'
import QuotesService from './services/quotes-service';

const services = {};
services.quotesService = new QuotesService();

function App() {
  let s = ["AAPL", "RDS-A", "BP", "BRK.A", "GOOG", "BP", "INTC"];
  const [subs, setSubs] = useState(s);

  return (
    <div className="App">
      <div className="ticker-row">
        <ServiceLocatorContext.Provider value={services} >
        {subs.map((val, index) => (
          <Ticker
            key={index}
            tickerSymbol={val}
            onRemove={val => {
              setSubs(subs.slice(0, subs.length - 1));
            }}
          />
        ))}
        </ServiceLocatorContext.Provider>
      </div>
    </div>
  );
}

export default App;
