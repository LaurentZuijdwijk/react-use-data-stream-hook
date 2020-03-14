import BaseService from "../lib/services/base-service";

class QuotesService extends BaseService {
  subscribe(val) {
    console.log("this.subscribe", val, this.subscriptions);
    let stream;
    let lastVal;

    let update = () => {
      if (val === "AAPL") {
        return setTimeout(() => {
          stream.write(new Error("something went wrong"));
          update = () => {};
        }, 5000);
      }

      if (this.hasSubscription(val)) {
        if (!lastVal) {
          lastVal = 20 + Math.random() * 1000;
          stream.write(lastVal);
        } else {
          lastVal = lastVal * 0.95 + Math.random() * lastVal * 0.1;
          stream.write(lastVal);
        }
        setTimeout(update,  100 + Math.random() * 5000);
      }
    };

    if (!this.hasSubscription(val)) {
      setTimeout(update, 1000);
    }
    stream = this.getStream(val);
    const f = stream.fork();
    return f;
  }
}

export default new QuotesService();
