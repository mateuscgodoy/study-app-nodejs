export default class InvalidQuery extends Error {
  private _query: string;
  constructor(message: string, query: string) {
    super(message);
    this._query = query;
  }

  get query() {
    return this._query;
  }
}
