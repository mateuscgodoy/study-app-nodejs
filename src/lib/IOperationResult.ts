export default interface IOperationResult<T = null> {
  message: string;
  error?: Error;
  data?: T;
}
