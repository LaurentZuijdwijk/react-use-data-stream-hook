import Highland from "highland";

import Subscription from "../subscription";

class BaseService<T> {
  debug: boolean;
  subscriptions: Map<string, { count: number; stream: Highland.Stream<T> }>;

  constructor({ debug } = { debug: false }) {
    this.debug = debug;
    this.subscriptions = new Map();
  }

  hasSubscription(sub: string): boolean {
    return this.subscriptions.has(sub) && this.subscriptions.get(sub)!.count > 0;
  }

  private getNewStream(sub: string): Highland.Stream<T> {
    if (this.hasSubscription(sub)) {
      const subscription = this.subscriptions.get(sub)!;
      subscription.count++;
      return subscription.stream;
    } else {
      const newSub: { count: number; stream: Highland.Stream<T> } = {
        count: 1,
        stream: Highland()
      };
      this.subscriptions.set(sub, newSub);
      return newSub.stream;
    }
  }
  write(subscriptionKey: string, value: T): this {
    if (this.hasSubscription(subscriptionKey)) {
      this.subscriptions.get(subscriptionKey)?.stream.write(value);
    } else {
      if (this.debug) {
        console.warn("No such subscription", subscriptionKey);
      }
    }
    return this;
  }
  subscribe(val: string): Subscription<T> {
    const stream = this.getNewStream(val);
    return new Subscription(val, stream, this.unsubscribe.bind(this));
  }

  unsubscribe(key: string, stream: Highland.Stream<T>) {
    stream.destroy();
    if (!this.subscriptions.has(key)) return;
    const sub = this.subscriptions.get(key)!;
    sub.count--;
    if (sub.count === 0) {
      sub.stream.destroy();
      this.subscriptions.delete(key);
    }
  }
}

export default BaseService;
