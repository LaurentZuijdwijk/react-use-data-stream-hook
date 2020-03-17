
import { BaseService } from "streamer";

class QuotesService extends BaseService {
  subscribe(tickerSymbol) {
    let subscription;
    let lastVal;

    let update = () => {
      if (tickerSymbol === "AAPL") {
        return setTimeout(() => {
          subscription.write(new Error("something went wrong"));
          update = () => {};
        }, 5000);
      }

      if (this.hasSubscription(tickerSymbol)) {
        if (!lastVal) {
          lastVal = 20 + Math.random() * 1000;
          subscription.write(lastVal);
        } else {
          lastVal = lastVal * 0.95 + Math.random() * lastVal * 0.1;
          subscription.write(lastVal);
        }
        setTimeout(update, 100 + Math.random() * 5000);
      }
    };

    if (!this.hasSubscription(tickerSymbol)) {
      setTimeout(update, 1000);
    }
    subscription = super.subscribe(tickerSymbol);
    return subscription;
  }
}

export default new QuotesService();
