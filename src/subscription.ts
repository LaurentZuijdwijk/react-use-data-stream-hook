export default class Subscription {
  key: string;
  private sourceStream: Highland.Stream<any>;
  stream: Highland.Stream<any>;
  filter: (f: (x: any) => boolean) => Highland.Stream<any>;
  each: (f: (x: any) => any) => Pick<Highland.Stream<any>, "done">;
  map: (f: (x: any) => any) => Highland.Stream<any>;
  write: (x: any) => boolean;
  cancel: () => void;

  constructor(
    key: string,
    sourceStream: Highland.Stream<any>,
    unsubFn: (
      key: string,
      stream: Highland.Stream<any>,
      source: Highland.Stream<any>
    ) => void
  ) {
    this.key = key;
    this.sourceStream = sourceStream;
    this.stream = sourceStream.fork();
    this.filter = this.stream.filter.bind(this.stream);
    this.each = this.stream.each.bind(this.stream);
    this.map = this.stream.map.bind(this.stream);
    this.write = this.sourceStream.write.bind(this.sourceStream);
    this.cancel = () => {
      this.stream.end()
      this.write = ()=>{ throw new Error('subscription has been cancelled')}
      unsubFn(this.key, this.stream, this.sourceStream);
    };
  }
}
