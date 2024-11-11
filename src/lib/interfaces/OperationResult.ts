export default interface OperationResult<T = null> {
  success: boolean;
  error?: Error;
  message: string;
  data?: T;
}
