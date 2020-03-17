import Subscription from "../subscription";
const _ = require("highland");

type SubValue = { count: number; stream: typeof _ };

class BaseService {
  subscriptions: Map<string, SubValue>;

  constructor() {
    this.subscriptions = new Map();
  }

  hasSubscription(sub: string): boolean {
    return this.subscriptions.has(sub) && this.subscriptions.get(sub)!.count > 0; // eslint-disable-line rule1 rule2
  }

  private getNewStream(sub: string): typeof _ {
    if (this.hasSubscription(sub)) {
      const subscription = this.subscriptions.get(sub)!;
      subscription.count++;
      return subscription.stream;
    } else {
      const newSub: SubValue = {
        count: 1,
        stream: _()
      };
      this.subscriptions.set(sub, newSub);
      return newSub.stream;
    }
  }
  write(subscriptionKey:string, value:any):boolean {
    if(this.hasSubscription(subscriptionKey) ){
      return this.subscriptions.get(subscriptionKey)?.stream.write(value)
    }
    else {
      throw new Error('no such subscripion')
    }

  }
  subscribe(val: string): Subscription {
    const stream = this.getNewStream(val);
    return new Subscription(val, stream, this.unsubscribe.bind(this));
  }

  unsubscribe(key: string, stream: typeof _) {
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
