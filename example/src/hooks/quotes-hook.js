import { useState, useEffect, useRef, useContext } from "react";
import ServiceLocator from "./../services/service-locator-context";

function QuotesHook(quote) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(null);
  const [lastValue, setLastValue] = useState(null);
  const last = useRef(null);
  const hasError = useRef(null);

  const quotesService = useContext(ServiceLocator).quotesService;


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
      subscription.cancel();
    };
  }, [quote]);
  return [value, lastValue, loading, error];
}

export default QuotesHook;
