export default class InvalidArgument extends Error {
  private _userMessage: string;
  constructor(message: string, userMessage?: string) {
    super(message);
    this._userMessage = userMessage ?? '';
  }

  get userMessage(): string {
    return this._userMessage;
  }
}
