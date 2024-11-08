export default class InvalidQuery extends Error {
  private query: string;
  constructor(message: string, query: string) {
    super(message);
    this.query = query;
  }
}
