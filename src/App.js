import React, { useState } from "react";
import "./App.css";
import Ticker from "./components/ticker";

function App() {
  let s = ["AAPL", "RDS-A", "BP", "BRK.A", "GOOG", "BP", "INTC"];
  const [subs, setSubs] = useState(s);

  return (
    <div className="App">
      <div className="ticker-row">
        {subs.map(val => (
          <Ticker
            tickerSymbol={val}
            onRemove={val => {
              setSubs(subs.slice(0, subs.length - 1));
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
