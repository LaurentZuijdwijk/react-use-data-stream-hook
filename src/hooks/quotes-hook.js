import { useState, useEffect, useRef } from "react";
import quotesService from "../services/quotes-service";

function QuotesHook(quote) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(null);
  const [lastValue, setLastValue] = useState(null);
  const last = useRef(null);
  const hasError = useRef(null);

  useEffect(() => {
    const subscription = quotesService.subscribe(quote);
    subscription.stream
      .filter(val => {
        if (val instanceof Error) {
          setError(val);
          setLoading(false);
          setValue(null);
          hasError.current = true;
          return false;
        }
        return true;
      })
      .on("data", newVal => {
        if (hasError.current) setError(null);
        if (loading) setLoading(false);
        setLastValue(last.current);
        last.current = newVal;
        setValue(newVal);
        // })
        // .each(newVal => {
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [quote]);
  return [value, lastValue, loading, error];
}

export default QuotesHook;
