const _ = require("highland");

class Service {
  constructor() {
    this.subscriptions = {};
  }

  hasSubscription(sub) {
    return this.subscriptions[sub] && this.subscriptions[sub].count > 0;
  }

  getStream(sub) {
    if (this.hasSubscription(sub)) {
      this.subscriptions[sub].count++;
      return this.subscriptions[sub].stream;
    } else {
      this.subscriptions[sub] = {};
      this.subscriptions[sub].count = 1;
      this.subscriptions[sub].stream = _();
      return this.subscriptions[sub].stream;
    }
  }
  unsubscribe(val, stream) {
    stream.destroy();
    this.subscriptions[val].count--;
    if (this.subscriptions[val].count === 0) {
      this.subscriptions[val].stream.destroy();
      delete this.subscriptions[val];
    }
    console.log("this.unsubscribe", this.subscriptions);
  }
}

class QuotesService extends Service {
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
          lastVal = lastVal * 0.95 + Math.random() * lastVal * 0.05;
          stream.write(lastVal);
        }
        setTimeout(update, 300 + Math.random() * 4000);
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
