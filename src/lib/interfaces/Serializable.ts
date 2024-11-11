export default interface Serializable<T> {
  serialize(): T;
  deserialize(value: T): void;
}
