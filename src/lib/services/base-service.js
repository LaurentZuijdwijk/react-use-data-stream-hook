import Subscription from "../subscription";
const _ = require("highland");

class BaseService {
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

  subscribe(val) {
    const stream = this.getStream(val);
    return new Subscription(val, stream, this.unsubscribe.bind(this));
  }

  unsubscribe(val, stream) {
    stream.destroy();
    this.subscriptions[val].count--;
    if (this.subscriptions[val].count === 0) {
      this.subscriptions[val].stream.destroy();
      delete this.subscriptions[val];
    }
  }
}

export default BaseService;
