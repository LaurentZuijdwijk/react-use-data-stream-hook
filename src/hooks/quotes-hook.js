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
    const stream = quotesService.subscribe(quote);
    stream.filter((val) => {
        if( val instanceof Error){
            setError(val);
            setLoading(false)
            setValue(null)
            hasError.current = true
            return false
        }
        return true
    })
    .each(newVal => {
      if (hasError.current) setError(null);
      if (loading) setLoading(false);
      setLastValue(last.current);
      last.current = newVal;
      setValue(newVal);
    });
    return () => {
      quotesService.unsubscribe(quote, stream);
    };
  }, []);
  return [value, lastValue, loading, error];
}

export default QuotesHook;
