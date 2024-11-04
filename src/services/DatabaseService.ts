import { DatabaseSync } from 'node:sqlite';

import createQuestionsQuery from '../lib/createDatabaseQuery';

export default class DatabaseService {
  private instance: DatabaseSync;

  constructor(dbPath: string = ':memory:') {
    this.instance = new DatabaseSync(dbPath);
    this.instance.exec(createQuestionsQuery);
  }
}
