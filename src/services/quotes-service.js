import BaseService from "../lib/services/base-service";

class QuotesService extends BaseService {
  subscribe(val) {
    let subscription;
    let lastVal;

    let update = () => {
      if (val === "AAPL") {
        return setTimeout(() => {
          subscription.write(new Error("something went wrong"));
          update = () => {};
        }, 5000);
      }

      if (this.hasSubscription(val)) {
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

    if (!this.hasSubscription(val)) {
      setTimeout(update, 1000);
    }
    subscription = super.subscribe(val);
    return subscription;
  }
}

export default new QuotesService();
