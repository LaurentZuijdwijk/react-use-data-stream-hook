export default class Subscription {
  constructor(value, sourceStream, unsubFn) {
    this.subscriptionValue = value;
    this.sourceStream = sourceStream;
    this.stream = sourceStream.fork();
    this.filter = this.stream.filter.bind(this.stream);
    this.each = this.stream.each.bind(this.stream);
    this.map = this.stream.map.bind(this.stream);
    this.write = this.sourceStream.write.bind(this.sourceStream);
    this.unsubscribe = () => {
      unsubFn(this.subscriptionValue, this.stream, this.sourceStream);
    };
  }
}
