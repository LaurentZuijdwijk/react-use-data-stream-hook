import React, { useRef } from "react";
import QuotesHook from "../hooks/quotes-hook";

function TickerContainer({quote = 'AAPL', onRemove}) {
  const [value, lastValue, loading, error] = QuotesHook(quote);
  return (
    <MemoTicker
      value={value}
      lastValue={lastValue}
      loading={loading}
      error={error}
      quote={quote}
      onRemove={onRemove}
    />
  );
}

function Ticker({ value, lastValue, loading, error, quote, onRemove }) {
  const element = useRef();
  if (value > lastValue) {
    element.current.classList.remove("Ticker-up");
    element.current.classList.remove("Ticker-down");

    window.requestAnimationFrame(function(time) {
      window.requestAnimationFrame(function(time) {
        element.current.classList.add("Ticker-up");
      });
    });
  } else if (value < lastValue) {
    element.current.classList.remove("Ticker-down");
    element.current.classList.remove("Ticker-up");
    window.requestAnimationFrame(function(time) {
      window.requestAnimationFrame(function(time) {
        element.current.classList.add("Ticker-down");
      });
    });
  }

  return (
    <div className={`Ticker`} ref={element} onClick={onRemove}>
      <span className="Ticker-name">{quote}</span>
      {error && <span>error</span>}
      {loading && <span>loading</span>}
      {value && <span>{value.toFixed(2)}</span>}
    </div>
  );
}

const MemoTicker = (Ticker);

export default TickerContainer;