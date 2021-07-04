export default class Subscription<T> {
    key: string;
    private sourceStream: Highland.Stream<T>;
    stream: Highland.Stream<T>;
    filter: (f: (x: T) => boolean) => Highland.Stream<T>;
    each: (f: (x: T) => any) => Pick<Highland.Stream<T>, 'done'>;
    map: (f: (x: T) => any) => Highland.Stream<T>;
    write: (x: T) => boolean;
    cancel: () => void;

    constructor(
        key: string,
        sourceStream: Highland.Stream<T>,
        unsubFn: (key: string, stream: Highland.Stream<T>, source: Highland.Stream<T>) => void,
    ) {
        this.key = key;
        this.sourceStream = sourceStream;
        this.stream = sourceStream.fork();
        this.filter = this.stream.filter.bind(this.stream);
        this.each = this.stream.each.bind(this.stream);
        this.map = this.stream.map.bind(this.stream);
        this.write = this.sourceStream.write.bind(this.sourceStream);
        this.cancel = () => {
            this.stream.end();
            this.write = () => {
                throw new Error('subscription has been cancelled');
            };
            unsubFn(this.key, this.stream, this.sourceStream);
        };
    }
}
