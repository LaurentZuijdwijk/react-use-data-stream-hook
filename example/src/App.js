import React, { useState } from "react";
import "./App.css";
import Ticker from "./components/ticker";
import FactComponent from "./components/fact/fact-component";
import ServiceLocatorContext from './services/service-locator-context'
import QuotesService from './services/quotes-service';
import FactService from './services/fact-service';

const services = {};
services.quotesService = new QuotesService();
services.factService = new FactService();

function App() {
  let s = ["AAPL", "RDS-A", "BP", "BRK.A", "GOOG", "BP", "INTC"];
  const [subs, setSubs] = useState(s);

  return (
    <div className="App">
      <ServiceLocatorContext.Provider value={services} >
        <FactComponent />
          <div className="ticker-row">
            {subs.map((val, index) => (
              <Ticker
                key={index}
                tickerSymbol={val}
                onRemove={val => {
                  setSubs(subs.slice(0, subs.length - 1));
                }}
              />
            ))}
          </div>
        </ServiceLocatorContext.Provider>
    </div>
  );
}

export default App;
